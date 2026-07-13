// Client-side visual style dictionary matrix
export const SKILL_THEME_MAP = {
  "react-next": {
    trackColor: "bg-blue-500",
    iconColor: "text-blue-500",
    iconName: "Code2",
  },
  "node-express": {
    trackColor: "bg-amber-500",
    iconColor: "text-amber-500",
    iconName: "Terminal",
  },
  "db-mgmt": {
    trackColor: "bg-slate-400",
    iconColor: "text-slate-400",
    iconName: "Database",
  },
  "aws-devops": {
    trackColor: "bg-orange-500",
    iconColor: "text-orange-500",
    iconName: "Cloud",
  },
} as const;

export type SkillId = keyof typeof SKILL_THEME_MAP;
