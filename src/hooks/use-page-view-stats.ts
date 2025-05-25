
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PageViewStats {
  page_path: string;
  total_views: number;
  unique_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

export const usePageViewStats = () => {
  return useQuery({
    queryKey: ['page-view-stats'],
    queryFn: async (): Promise<PageViewStats[]> => {
      const { data, error } = await supabase.rpc('get_page_view_stats');
      
      if (error) {
        console.error('Error fetching page view stats:', error);
        throw error;
      }
      
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
