import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
// middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// GET /api/user/:username
app.get("/api/user/:username", async (req, res) => {
  const username = (req.params.username || "").trim();
  if (!req.params.username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const url = `https://letterboxd.com/${encodeURIComponent(username)}/`;

  try {
    const response = await axios.get(url, {
      headers: {
        // avoid basic bot blocking by pretending to be a real browser
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // selectors
    //
    // page 1's selectors
    const ogTitleContent = $('meta[property="og:title"]').attr("content");
    const pageName : string | null = ogTitleContent ? ogTitleContent.trim() : null;
    const descriptionContent = $('meta[name="description"]').attr("content");
    const bio : string | null = descriptionContent ? descriptionContent.trim() : null;
    const mostRecentReview = $(".js-review-body").eq(0).text().trim();
    const mostRecentMovie = $("h2.name.-primary.prettify a").eq(0).text().trim();

    // quick sanity check for “user not found”
    const isNotFound =
      $("title").text().toLowerCase().includes("page not found") ||
      $("h1").text().toLowerCase().includes("page not found");

    if (isNotFound) return res.status(404).json({ error: "User not found" });

    return res.json({
      username,
      url,
      pageName,
      bio,
      mostRecentReview,
      mostRecentMovie,
    });

  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return res.status(404).json({ error: "User not found" });
    console.error("Fetch error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch Letterboxd page" });
  }
});

app.get("/api/user/:username/year", async (req, res) => {
  const username = (req.params.username || "").trim();
  if (!req.params.username) {
    return res.status(400).json({ error: "Missing username" });
  }

  const url = `https://letterboxd.com/${encodeURIComponent(username)}/diary/films/for/2025/`;

  try {
    const response = await axios.get(url, {
      headers: {
        // avoid basic bot blocking by pretending to be a real browser
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: () => true,
    });
    // TODO: CURRENTLY HITTING ERROR BECAUSE OF CLOUDFLARE ANTI-BOT CHECKS; FIGURE OUT HOW TO BYPASS (SECURELY AND LEGALLY, OFC :P)
    console.log("Status:", response.status);
    console.log(String(response.data).slice(0, 300));

    const html = response.data;
    const $ = cheerio.load(html);

    // selectors
    // TODO: 'ratings' IS AN ARBITRARY CLASS NAME THAT IS A PLACEHOLDER
    const ratings = $(".hide-for-owner").eq(0).text().trim();
    
    return res.json({
      ratings,
    });

  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return res.status(404).json({ error: "User not found" });
    console.error("Fetch error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch Letterboxd page" });
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});