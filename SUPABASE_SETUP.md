# Supabase Setup Instructions

## Database Setup for Real-Time Visitor Counter

To enable the real-time visitor counter feature, you need to run the migration on your Supabase database.

### Steps:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Run the Migration**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy the entire contents of `supabase_migration.sql` file
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl/Cmd + Enter

3. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `visitors`
     - `page_views`
   - Both tables should have RLS enabled (green shield icon)

4. **Test the Application**
   - Visit your deployed application
   - The visitor counter should now display real-time data
   - Check the Supabase dashboard to see new records being created

### Troubleshooting

If you encounter any issues:

1. **Check RLS Policies**
   - Go to "Authentication" > "Policies"
   - Ensure all policies are created correctly

2. **Check Realtime**
   - Go to "Database" > "Replication"
   - Ensure "visitors" and "page_views" tables have realtime enabled

3. **Check Environment Variables**
   - Verify `.env` file contains correct Supabase URL and API key
   - These should already be configured by default

### Migration File Location

The migration SQL file is located at:
```
/tmp/cc-agent/57848950/project/supabase_migration.sql
```

### What the Migration Does

1. Creates `visitors` table to track unique visitors
2. Creates `page_views` table to track individual page visits
3. Sets up Row Level Security (RLS) policies for public access
4. Creates indexes for optimal query performance
5. Creates a function `get_visitor_stats()` to fetch aggregated statistics
6. Enables real-time subscriptions for live updates

### Database Schema

**visitors table:**
- `id`: UUID (primary key)
- `session_id`: Text (unique) - Browser session identifier
- `page_views`: Integer - Total page views for this session
- `first_visit`: Timestamp - First visit time
- `last_visit`: Timestamp - Most recent visit time
- `user_agent`: Text - Browser user agent
- `ip_address`: Text - Visitor IP (optional)
- `created_at`: Timestamp - Record creation time

**page_views table:**
- `id`: UUID (primary key)
- `session_id`: Text - Reference to visitor session
- `page_url`: Text - URL of visited page
- `visited_at`: Timestamp - Visit timestamp
- `created_at`: Timestamp - Record creation time

