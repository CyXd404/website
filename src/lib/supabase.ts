import { createClient } from '@supabase/supabase-js';
import { getOrCreateVisitorIdentifier, isNewVisitor } from './fingerprint';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
  } else {
    console.warn('Supabase credentials not found. Visitor tracking will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export { supabase };

export interface VisitorStats {
  total_visitors: number;
  total_page_views: number;
  today_visitors: number;
  today_page_views: number;
}

let lastTrackTime = 0;
const TRACK_DEBOUNCE = 5000;

export const trackVisitor = async () => {
  if (!supabase) {
    console.warn('Supabase not initialized. Skipping visitor tracking.');
    return;
  }

  try {
    const now = Date.now();

    if (now - lastTrackTime < TRACK_DEBOUNCE) {
      return;
    }

    lastTrackTime = now;

    const identifier = await getOrCreateVisitorIdentifier();
    const userAgent = navigator.userAgent;
    const isNew = isNewVisitor();

    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('*')
      .eq('session_id', identifier.sessionId)
      .maybeSingle();

    if (existingVisitor) {
      const timeSinceLastVisit = now - new Date(existingVisitor.last_visit).getTime();
      const shouldIncrementPageView = timeSinceLastVisit > 30000;

      await supabase
        .from('visitors')
        .update({
          page_views: shouldIncrementPageView
            ? existingVisitor.page_views + 1
            : existingVisitor.page_views,
          last_visit: new Date().toISOString()
        })
        .eq('session_id', identifier.sessionId);
    } else {
      await supabase
        .from('visitors')
        .insert({
          session_id: identifier.sessionId,
          user_agent: userAgent,
          ip_address: identifier.fingerprint,
          page_views: 1
        });
    }

    const currentPath = window.location.pathname;
    const lastTrackedPath = sessionStorage.getItem('last_tracked_path');
    const lastTrackedTime = parseInt(sessionStorage.getItem('last_tracked_time') || '0');

    if (currentPath !== lastTrackedPath || (now - lastTrackedTime) > 30000) {
      await supabase
        .from('page_views')
        .insert({
          session_id: identifier.sessionId,
          page_url: currentPath
        });

      sessionStorage.setItem('last_tracked_path', currentPath);
      sessionStorage.setItem('last_tracked_time', now.toString());
    }

  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

export const getVisitorStats = async (): Promise<VisitorStats> => {
  if (!supabase) {
    return {
      total_visitors: 0,
      total_page_views: 0,
      today_visitors: 0,
      today_page_views: 0
    };
  }

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
