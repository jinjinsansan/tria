import { cache } from 'react';

import { CONTRIBUTION_POINTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export type PlacementSettings = {
  admin_ratio: number;
};

export type ContributionSettings = typeof CONTRIBUTION_POINTS;

const DEFAULT_PLACEMENT_SETTINGS: PlacementSettings = {
  admin_ratio: 0.2,
};

const DEFAULT_CONTRIBUTION_SETTINGS: ContributionSettings = { ...CONTRIBUTION_POINTS };

export const getPlacementSettings = cache(async (): Promise<PlacementSettings> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'placement_settings')
    .maybeSingle();

  const value = (data?.value as PlacementSettings | null) ?? DEFAULT_PLACEMENT_SETTINGS;
  return {
    admin_ratio: typeof value.admin_ratio === 'number' ? value.admin_ratio : DEFAULT_PLACEMENT_SETTINGS.admin_ratio,
  };
});

export const getContributionSettings = cache(async (): Promise<ContributionSettings> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'contribution_points')
    .maybeSingle();

  const value = (data?.value as ContributionSettings | null) ?? DEFAULT_CONTRIBUTION_SETTINGS;
  return { ...DEFAULT_CONTRIBUTION_SETTINGS, ...value };
});
