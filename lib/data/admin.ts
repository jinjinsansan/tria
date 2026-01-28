import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';

export const getAdminOverview = cache(async () => {
  const supabase = await createClient();

  const [totalUsersRes, newWeekRes, newMonthRes, queuePendingRes, placementCountRes, topUsersRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('organic_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('organic_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'assigned')
      .gte('assigned_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('users')
      .select('id, display_name, contribution_points, total_downlines')
      .order('contribution_points', { ascending: false })
      .limit(5),
  ]);

  return {
    totalUsers: totalUsersRes.count ?? 0,
    newUsersWeek: newWeekRes.count ?? 0,
    newUsersMonth: newMonthRes.count ?? 0,
    queuePending: queuePendingRes.count ?? 0,
    placementsToday: placementCountRes.count ?? 0,
    topUsers: topUsersRes.data ?? [],
  };
});

type PlacementUser = { id: string; display_name: string | null } | null;

export const getRecentPlacements = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organic_queue')
    .select(
      `id, visitor_id, source, assigned_at, assigned_user:users!organic_queue_assigned_to_fkey (
        id, display_name
      )`
    )
    .eq('status', 'assigned')
    .order('assigned_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((item) => ({
    ...item,
    assigned_user: Array.isArray(item.assigned_user)
      ? (item.assigned_user[0] as PlacementUser)
      : (item.assigned_user as PlacementUser),
  }));
});
