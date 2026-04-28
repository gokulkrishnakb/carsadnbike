// Brand Colors - Change these values to update colors across the entire app
// After changing, all components that import these will use the new colors

export const brandColors = {
  // Main brand red color
  red: "#9b111e",           // Dark crimson - primary brand color
  redDark: "#7b0d18",       // Darker shade for hover states & gradients
  redDarker: "#5c0a12",     // Darkest shade for deep hover/active
  redLight: "#fef2f2",      // Light red for backgrounds
  redRing: "rgba(155, 17, 30, 0.2)", // For focus rings
} as const;

// CSS class helpers for common patterns
export const brandClasses = {
  // Gradient backgrounds
  gradient: `from-[${brandColors.red}] to-[${brandColors.redDark}]`,
  gradientHover: `hover:from-[${brandColors.redDark}] hover:to-[${brandColors.redDarker}]`,

  // Text colors
  text: `text-[${brandColors.red}]`,
  textHover: `hover:text-[${brandColors.red}]`,

  // Background colors
  bg: `bg-[${brandColors.red}]`,
  bgHover: `hover:bg-[${brandColors.redDark}]`,
} as const;
