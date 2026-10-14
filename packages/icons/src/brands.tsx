// Third-party brand marks for "Sign in with …" buttons.
//
// Deliberate exception to "tokens only": a brand mark must keep its owner's official colours
// and shape, as required by each provider's sign-in branding guidelines. Use these marks only to
// identify that provider (e.g. on an SSO button), at their natural proportions, never recoloured.
//
// Sources:
//  - Microsoft: four-square logo, per Microsoft identity platform sign-in branding guidelines.
//  - Google: four-colour "G", per Google Identity "Sign in with Google" branding guidelines.
//  - Okta: logomark from Okta media assets (path via simple-icons 16.35.0, CC0; colour #007DC1).
import type { SVGProps } from "react";

type BrandMarkProps = Omit<SVGProps<SVGSVGElement>, "children">;

const base = (props: BrandMarkProps): SVGProps<SVGSVGElement> => ({
  "aria-hidden": true,
  focusable: false,
  width: 20,
  height: 20,
  ...props,
});

export function MicrosoftMark(props: BrandMarkProps) {
  return (
    <svg viewBox="0 0 21 21" {...base(props)}>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export function GoogleMark(props: BrandMarkProps) {
  return (
    <svg viewBox="0 0 48 48" {...base(props)}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function OktaMark(props: BrandMarkProps) {
  return (
    <svg viewBox="0 0 24 24" {...base(props)}>
      <path
        fill="#007DC1"
        d="M12 0C5.389 0 0 5.35 0 12s5.35 12 12 12 12-5.35 12-12S18.611 0 12 0zm0 18c-3.325 0-6-2.675-6-6s2.675-6 6-6 6 2.675 6 6-2.675 6-6 6z"
      />
    </svg>
  );
}

/** Identity-provider id (as in the API's AuthProvider.id) → brand mark. */
export const identityProviderMarks = {
  entra: MicrosoftMark,
  google: GoogleMark,
  okta: OktaMark,
} as const;
