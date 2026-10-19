// The only link between warung.my and warung.pro. The plan travels as ?plan=
// and warung.pro carries it through sign-up and onboarding to billing.
export const APP_URL = 'https://warung.pro';

export const signupUrl = (plan: 'free' | 'pro' | 'business' = 'free') =>
  `${APP_URL}/register?plan=${plan}`;

export const loginUrl = `${APP_URL}/login`;
