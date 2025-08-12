import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await client.connect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { profile_url, stars = 0, feedback_type = null, comment = '', screenshot_url = '' } = req.body;

    if (!profile_url) {
      return res.status(400).json({ error: 'profile_url es obligatorio' });
    }

    if (!(stars >= 0 && stars <= 5)) {
      return res.status(400).json({ error: 'stars debe estar entre 0 y 5' });
    }

    if (feedback_type && !['positive', 'negative'].includes(feedback_type)) {
      return res.status(400).json({ error: 'feedback_type inválido' });
    }

    try {
      const query = `
        INSERT INTO reviews (profile_url, stars, feedback_type, comment, screenshot_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;
      const values = [profile_url, stars, feedback_type, comment, screenshot_url];
      const result = await client.query(query, values);

      return res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM reviews ORDER BY date_added DESC LIMIT 50');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener opiniones' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }
}
