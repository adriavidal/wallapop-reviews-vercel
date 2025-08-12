import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { username, profile_url, stars, comment } = req.body;
      if (!username || !stars) {
        return res.status(400).json({ error: "Missing username or stars" });
      }
      await pool.query(
        "INSERT INTO reviews (username, profile_url, stars, comment) VALUES ($1, $2, $3, $4)",
        [username, profile_url || null, stars, comment || ""]
      );
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM reviews ORDER BY date_added DESC");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
