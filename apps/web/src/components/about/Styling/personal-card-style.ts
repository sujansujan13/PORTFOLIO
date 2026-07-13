export const PERSONAL_CARD_THEME = {
  Coffee: {
    icon: "Coffee",
    color: "text-blue-500",
  },
  Globe: {
    icon: "Globe",
    color: "text-amber-500",
  },
  Dog: {
    icon: "Dog",
    color: "text-rose-500",
  },
  Dumbbell: {
    icon: "Dumbbell",
    color: "text-indigo-500",
  },
} as const;

export type PersonalTheme = keyof typeof PERSONAL_CARD_THEME;
