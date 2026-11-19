/**
 * Official JLU-inspired Unified Colour Palette & Design Tokens
 * 
 * Standardized across the entire Jagran Lakecity University ERP ecosystem.
 */

export const ERP_THEME = {
  primary: {
    burgundy: "#861F41",      // Primary brand accent & active states
    dark: "#64152F",          // Hover & deep active states
    light: "#F9EEF2",         // Selected background tint
    white: "#FFFFFF",         // Crisp card/sidebar surfaces
  },
  background: {
    main: "#F7F7F9",          // Application canvas background
    sidebar: "#FFFFFF",       // Clean institutional sidebar
    card: "#FFFFFF",          // Standard card surfaces
    secondary: "#F1F2F5",     // Section backgrounds & chips
    tableHeader: "#F8F8FA",   // Professional table header row
  },
  typography: {
    primary: "#202435",       // Deep charcoal primary text
    secondary: "#697386",     // Slate secondary labels & metadata
    muted: "#9299A8",         // Muted timestamps & placeholders
    onBurgundy: "#FFFFFF",    // High contrast white text on burgundy
  },
  border: {
    default: "#E5E7EB",       // Default boundary lines
    subtle: "#EEF0F3",        // Inner table & divider lines
    active: "#861F41",        // Focused input & active navigation borders
  },
  semantic: {
    success: "#16845B",
    successBg: "#EAF7F0",
    warning: "#B7791F",
    warningBg: "#FFF7E6",
    error: "#C23B4A",
    errorBg: "#FCEDEF",
    info: "#3567A5",
    infoBg: "#EDF3FA",
  },
} as const;
