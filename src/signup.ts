// The only link between warung.my and pos.warung.my. The plan travels as ?plan=
// and pos.warung.my carries it through sign-up and onboarding to billing.
export const APP_URL = 'https://pos.warung.my';

export const signupUrl = (plan: 'free' | 'pro' | 'business' = 'free') =>
  `${APP_URL}/register?plan=${plan}`;

export const loginUrl = `${APP_URL}/login`;
