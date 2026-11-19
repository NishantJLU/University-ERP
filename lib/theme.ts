/**
 * Official Jagran Lakecity University (JLU) Design Tokens
 * 
 * Extracted directly from official university branding (https://www.jlu.edu.in/).
 * Primary Brand: #027EA1 (JLU Ocean / Lake Teal)
 * Brand Slate: #21313C (Official dark charcoal navy foundation)
 * Brand Gold: #F0C14B (University academic gold / torch emblem accent)
 */

export const JLU_THEME = {
  brand: {
    primary: "#027EA1",       // Official JLU Lake Teal (Buttons, active states, key accents)
    primaryHover: "#026A88",  // Interactive hover state
    primaryDark: "#015D77",   // Deep active state & selected text
    primaryLight: "#EAF5F8",  // Active navigation & badge tint background
    primaryBorder: "#BEE1EC", // Tint border for light badges
    slate: "#21313C",         // Primary brand dark foundation (headings, dark cards, footer)
    slateHover: "#1A2730",    // Dark slate hover
    gold: "#F0C14B",          // JLU warm academic gold accent
    goldLight: "#FEF8E7",     // Gold light wash
    lime: "#D4E4A0",          // Fresh university secondary highlight
    white: "#FFFFFF",         // Crisp card/sidebar surfaces
  },
  background: {
    canvas: "#F8F9FA",        // Light institutional application canvas
    sidebar: "#FFFFFF",       // Clean institutional sidebar
    card: "#FFFFFF",          // Standard card surfaces
    secondary: "#F1F3F5",     // Neutral chips, search inputs, secondary strips
    tableHeader: "#F8F9FA",   // Table header row background
    subtle: "#FAFBFC",        // Hover table row & alternate cards
  },
  typography: {
    fontFamily: '"Aptos", "Aptos Display", system-ui, -apple-system, sans-serif',
    primary: "#21313C",       // Official JLU deep slate primary text
    secondary: "#546574",     // Slate secondary labels, descriptions, subheadings
    muted: "#8D9BA8",         // Muted timestamps, breadcrumb dividers, placeholders
    onPrimary: "#FFFFFF",     // White text on brand buttons
    onSlate: "#FFFFFF",       // White text on dark slate surfaces
    link: "#027EA1",          // Interactive link color
    linkHover: "#015D77",     // Interactive link hover
  },
  border: {
    default: "#E2E8F0",       // Default boundary lines
    subtle: "#EAEDF0",        // Inner table & divider lines
    active: "#027EA1",        // Focused input & active navigation borders
    hover: "#CBD5E1",         // Border hover
  },
  semantic: {
    success: "#16845B",
    successBg: "#EAF7F0",
    successBorder: "#B7EAD0",
    warning: "#B7791F",
    warningBg: "#FFF7E6",
    warningBorder: "#FDE5A9",
    error: "#C23B4A",
    errorBg: "#FCEDEF",
    errorBorder: "#F9CBD2",
    info: "#027EA1",
    infoBg: "#EAF5F8",
    infoBorder: "#BEE1EC",
  },
} as const;

// Backward-compatible alias for existing imports
export const ERP_THEME = {
  primary: {
    burgundy: JLU_THEME.brand.primary,
    dark: JLU_THEME.brand.primaryDark,
    light: JLU_THEME.brand.primaryLight,
    white: JLU_THEME.brand.white,
  },
  background: {
    main: JLU_THEME.background.canvas,
    sidebar: JLU_THEME.background.sidebar,
    card: JLU_THEME.background.card,
    secondary: JLU_THEME.background.secondary,
    tableHeader: JLU_THEME.background.tableHeader,
  },
  typography: {
    primary: JLU_THEME.typography.primary,
    secondary: JLU_THEME.typography.secondary,
    muted: JLU_THEME.typography.muted,
    onBurgundy: JLU_THEME.typography.onPrimary,
  },
  border: {
    default: JLU_THEME.border.default,
    subtle: JLU_THEME.border.subtle,
    active: JLU_THEME.border.active,
  },
  semantic: JLU_THEME.semantic,
} as const;
