export type FeedActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

export const initialFeedState: FeedActionState = { ok: true };
