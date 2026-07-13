export const THEMES = {
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
} as const;

export type ThemeType = keyof typeof THEMES;
