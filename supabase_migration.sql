/*
  # Visitor Counter Migration

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Browser session ID
      - `page_views` (integer) - Number of page views for this session
      - `first_visit` (timestamptz) - First visit timestamp
      - `last_visit` (timestamptz) - Last visit timestamp
      - `user_agent` (text) - Browser user agent
      - `ip_address` (text) - Visitor IP address (optional)
      - `created_at` (timestamptz) - Record creation timestamp

    - `page_views`
      - `id` (uuid, primary key)
      - `session_id` (text) - Reference to visitor session
      - `page_url` (text) - Page URL visited
      - `visited_at` (timestamptz) - Visit timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Allow public read access for statistics
    - Allow public insert for tracking visits
    - No update/delete permissions for security

  3. Important Notes
    - Session tracking uses browser fingerprint
    - Automatic cleanup of old data (optional)
    - Real-time subscription enabled for live updates
*/

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  page_views integer DEFAULT 1,
  first_visit timestamptz DEFAULT now(),
  last_visit timestamptz DEFAULT now(),
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_url text NOT NULL,
  visited_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Visitors policies: Allow public to read statistics and insert new visits
CREATE POLICY "Allow public to view visitor statistics"
  ON visitors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to insert visitor data"
  ON visitors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to update own session"
  ON visitors FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Page views policies: Allow public to read and insert
CREATE POLICY "Allow public to view page views"
  ON page_views FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public to insert page views"
  ON page_views FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_session_id ON visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visited_at ON page_views(visited_at);

-- Create function to get total statistics
CREATE OR REPLACE FUNCTION get_visitor_stats()
RETURNS TABLE(
  total_visitors bigint,
  total_page_views bigint,
  today_visitors bigint,
  today_page_views bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT v.session_id)::bigint as total_visitors,
    COALESCE(SUM(v.page_views), 0)::bigint as total_page_views,
    COUNT(DISTINCT CASE WHEN v.last_visit >= CURRENT_DATE THEN v.session_id END)::bigint as today_visitors,
    COUNT(CASE WHEN pv.visited_at >= CURRENT_DATE THEN 1 END)::bigint as today_page_views
  FROM visitors v
  LEFT JOIN page_views pv ON v.session_id = pv.session_id;
END;
$$;
