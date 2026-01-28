import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';

type QueueUser = { id: string; display_name: string | null } | null;

export type QueueItem = {
  id: string;
  visitor_id: string;
  source: string | null;
  status: string;
  assigned_at: string | null;
  created_at: string;
  assigned_to: string | null;
  assigned_user: QueueUser;
};

const QUEUE_SELECT = `
  id,
  visitor_id,
  source,
  status,
  assigned_at,
  created_at,
  assigned_to,
  assigned_user:users!organic_queue_assigned_to_fkey (id, display_name)
`;

export const getQueueStats = cache(async () => {
  const supabase = await createClient();

  const [{ count: pending = 0 }, { count: assigned = 0 }] = await Promise.all([
    supabase.from('organic_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('organic_queue').select('id', { count: 'exact', head: true }).eq('status', 'assigned'),
  ]);

  return { pending, assigned };
});

export const getRecentQueueItems = cache(async (): Promise<QueueItem[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organic_queue')
    .select(QUEUE_SELECT)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((item) => ({
    ...item,
    assigned_user: Array.isArray(item.assigned_user)
      ? (item.assigned_user[0] as QueueUser)
      : (item.assigned_user as QueueUser),
  }));
});
