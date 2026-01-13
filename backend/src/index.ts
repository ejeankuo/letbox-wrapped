import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
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
  if (!username) return res.status(400).json({ error: "Missing username" });

  const url = `https://letterboxd.com/${encodeURIComponent(username)}/`;

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        // helps avoid basic bot blocking
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html);

    // These selectors may change over time; treat as a starting point.
    const displayName =
      $('meta[property="og:title"]').attr("content")?.trim() || null;

    const bio =
      $('meta[name="description"]').attr("content")?.trim() || null;

    // quick sanity check for “user not found”
    const isNotFound =
      $("title").text().toLowerCase().includes("page not found") ||
      $("h1").text().toLowerCase().includes("page not found");

    if (isNotFound) return res.status(404).json({ error: "User not found" });

    return res.json({
      username,
      url,
      displayName,
      bio,
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