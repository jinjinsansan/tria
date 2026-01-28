export type FieldErrorKey = 'email' | 'password' | 'display_name' | 'referral_code';

export type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<FieldErrorKey, string>>;
};

export const initialAuthState: AuthFormState = { ok: true };
