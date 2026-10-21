import { dark } from '@clerk/themes'

// One theme for every Clerk component: sign in/up modal, user menu, pricing table.
// Passed to <ClerkProvider appearance={clerkAppearance}> in main.jsx.
export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#00d3f2',
    colorPrimaryForeground: '#09090b',
    colorTextOnPrimaryBackground: '#09090b',
    colorBackground: '#18181b',
    colorInputBackground: '#09090b',
    colorText: '#f4f4f5',
    colorTextSecondary: '#a1a1aa',
    borderRadius: '0.375rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8rem',
    spacing: '0.8rem',
  },
  elements: {
    // hides the "Development mode / Secured by Clerk" strip in the user menu
    userButtonPopoverFooter: { display: 'none' },
    // pricing cards: same as Tailwind bg-zinc-900/50
    pricingTableCard: { backgroundColor: 'rgba(24, 24, 27, 0.5)' },
    pricingTableCardHeader: { backgroundColor: 'transparent' },
    pricingTableCardBody: { backgroundColor: 'transparent' },
    pricingTableCardFooter: { backgroundColor: 'transparent' },
  },
}
