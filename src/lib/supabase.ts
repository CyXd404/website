import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

export interface VisitorStats {
  total_visitors: number;
  total_page_views: number;
  today_visitors: number;
  today_page_views: number;
}

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('visitor_session_id');

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_session_id', sessionId);
  }

  return sessionId;
};

export const trackVisitor = async () => {
  try {
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;

    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existingVisitor) {
      await supabase
        .from('visitors')
        .update({
          page_views: existingVisitor.page_views + 1,
          last_visit: new Date().toISOString()
        })
        .eq('session_id', sessionId);
    } else {
      await supabase
        .from('visitors')
        .insert({
          session_id: sessionId,
          user_agent: userAgent,
          page_views: 1
        });
    }

    await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        page_url: window.location.pathname
      });

  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

export const getVisitorStats = async (): Promise<VisitorStats> => {
  try {
    const { data, error } = await supabase.rpc('get_visitor_stats');

    if (error) throw error;

    if (data && data.length > 0) {
      return {
        total_visitors: Number(data[0].total_visitors) || 0,
        total_page_views: Number(data[0].total_page_views) || 0,
        today_visitors: Number(data[0].today_visitors) || 0,
        today_page_views: Number(data[0].today_page_views) || 0
      };
    }

    return {
      total_visitors: 0,
      total_page_views: 0,
      today_visitors: 0,
      today_page_views: 0
    };
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return {
      total_visitors: 0,
      total_page_views: 0,
      today_visitors: 0,
      today_page_views: 0
    };
  }
};
