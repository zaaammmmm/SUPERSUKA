/** Single source of truth for the SUPERSUKA visual identity. */
export const DESIGN_TOKENS = {
  colors: {
    primary: "#155E38",
    primaryDark: "#0F4A2C",
    primarySoft: "#E4F1E8",
    secondary: "#C59B27",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#14261B",
    textMuted: "#44574B",
    statusNew: "#5E6E63",
    warning: "#A8540A",
    info: "#1C5DA8",
    success: "#1B7A43",
    danger: "#B3261E",
  },
  typography: {
    family: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    hero: "48px",
    h1: "32px",
    h2: "28px",
    h3: "20px",
    body: "14px",
    caption: "12px",
  },
  radius: { sm: "6px", md: "10px", lg: "16px" },
} as const;
