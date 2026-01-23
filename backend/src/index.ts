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

/**
 * GET /api/user/:username
 * Demo endpoint: fetch profile page HTML and return a few parsed fields.
 */
app.get("/api/user/:username", async (req, res) => {
  const username = (req.params.username || "").trim();
  if (!username) {
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
    // starting point; might change later
    /* const pageTitle = $("title").text()
    console.log(pageTitle); */
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
      mostRecentMovie
    });

  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 404) return res.status(404).json({ error: "User not found" });
    console.error("Fetch error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch Letterboxd page" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});