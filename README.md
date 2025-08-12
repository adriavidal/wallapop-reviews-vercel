  # Wallapop Reviews — Vercel + PostgreSQL

  This is a Vercel-ready version of the Wallapop manual rating tracker.

  ## Features
  - Store username, optional Wallapop profile URL, star rating, and comment
  - View all reviews in a public list
  - Works on Vercel serverless functions
  - Uses PostgreSQL (Neon, Supabase, or any hosted PG)

  ## Database Schema
  ```sql
  CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  profile_url TEXT,
  stars INTEGER NOT NULL,
  comment TEXT,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  ```

  ## Deployment Steps
  1. Create a PostgreSQL database (Neon/Supabase).
  2. Run the above SQL to create the `reviews` table.
  3. Fork or upload this project to Vercel.
  4. In Vercel dashboard, set environment variable:
     ```
     DATABASE_URL=postgresql://user:pass@host/dbname
     ```
  5. Deploy.

  ## Local Development
  Install dependencies:
  ```bash
  npm install
  npm run dev
  ```
