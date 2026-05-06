// Marketing site design tokens — single source of truth.
// Do NOT use styles/tokens.ts (app workspace tokens) for marketing components.
// Import: import { mkt } from '../tokens' (from components/)
//         import { mkt } from '../../tokens' (from components/ui/ or components/mocks/)

export const mkt = {

  // Typography
  type: {
    hero: 'clamp(40px, 5.6vw, 72px)',
    h2: 'clamp(32px, 3.6vw, 48px)',
    h3: 'clamp(20px, 1.8vw, 24px)',
    body: '17px',
    bodyLg: '18px',
    eyebrow: '12px',
    mono: '12px',
    monoLg: '13px',
    lede: '17px',
  },

  // Letter spacing
  tracking: {
    hero: '-0.035em',
    h2: '-0.03em',
    h3: '-0.015em',
    eyebrow: '-0.005em',
    tight: '-0.01em',
  },

  // Line height
  leading: {
    hero: '1.02',
    h2: '1.05',
    h3: '1.2',
    body: '1.7',
    lede: '26px',
  },

  // Colours
  color: {
    // Text
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    textSubtle: '#9CA3AF',
    textOnDark: '#F8FAFC',
    textOnDarkSecondary: '#94A3B8',

    // Surfaces
    white: '#FFFFFF',
    soft: '#FAFAF9',
    graph: '#F8F8F8',
    dark: '#0B0F19',
    darkRow: '#111827',
    darkCallout: '#1F2937',

    // Borders
    hairline: '#EBEBEB',
    hairline2: '#F0F0EE',
    borderCard: '#E4E4E2',
    borderDark: 'rgba(255,255,255,0.08)',
    borderDarkSubtle: 'rgba(255,255,255,0.05)',

    // Accents
    accent: '#2563EB',
    accentLight: '#EFF6FF',
    accentActive: '#93C5FD',
    accentText: '#1D4ED8',
    amber: '#F59E0B',
    amberBg: '#FEF3C7',
    amberText: '#92400E',

    // Semantic
    successFg: '#15803D',
    successBg: '#DCFCE7',
    warningFg: '#B45309',
    warningBg: '#FEF3C7',
    dangerFg: '#B91C1C',
    dangerBg: '#FEE2E2',

    // Legacy aliases kept for existing sections
    borderLight: '#EBEBEB',
    soft2: '#F8F9FA',
    textMono: '#94A3B8',
  },

  // Fonts
  font: {
    sans: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    mono: 'var(--font-jetbrains), "Geist Mono", ui-monospace, "SFMono-Regular", monospace',
    serif: 'var(--font-instrument-serif), "Times New Roman", Georgia, serif',
  },

  // Layout
  layout: {
    siteMax: '1200px',
    gutter: '24px',
  },

  // Spacing
  space: {
    sectionY: 'py-28 lg:py-36',
    contentMaxW: 'max-w-[600px]',
    containerMaxW: 'max-w-[1280px]',
    quietBridgeY: 'py-20',
  },

  // Motion
  motion: {
    expansionDelay: 0.12,
    expansionDuration: 0.25,
    hoverTransition: 0.15,
    entranceDuration: 0.5,
    stagger: 0.08,
  },

  // Dot grid
  dotGrid: {
    heroOpacity: 0.12,
    diagramOpacity: 0.08,
  },

  // Shadows
  shadow: {
    window: '0 1px 1px rgba(0,0,0,0.03), 0 6px 14px rgba(0,0,0,0.04), 0 22px 48px rgba(15,23,42,0.06)',
    hero: '0 1px 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.04), 0 32px 64px rgba(15,23,42,0.06)',
    node: '0 1px 2px rgba(0,0,0,0.04)',
  },

} as const
