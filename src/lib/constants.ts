export const APP_NAME = "PerklyPh";
export const APP_TAGLINE = "Your loyalty, rewarded.";
export const APP_SIGNUP_TAGLINE = "Your everyday rewards, made delightful.";

export const COLORS = {
  cloud: "#F7F8FB",
  ink: "#322D45",
  "mint-stamp": "#9FE0C7",
  "peach-reward": "#FFC9A3",
  "lavender-card": "#E4DFF5",
  "muted-gray": "#B9B4C9",
} as const;

export const CUSTOMER_TABS = [
  { label: "Home", href: "/home", iconName: "Home" },
  { label: "Scan", href: "/scan", iconName: "Scan" },
  { label: "Browse", href: "/browse", iconName: "Compass" },
  { label: "Rewards", href: "/rewards", iconName: "Gift" },
  { label: "Settings", href: "/settings", iconName: "User" },
] as const;

export const BUSINESS_TABS = [
  { label: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" },
  { label: "Scan", href: "/biz/scan", iconName: "Scan" },
  { label: "Cards", href: "/cards", iconName: "CreditCard" },
  { label: "Records", href: "/records", iconName: "FileText" },
  { label: "Settings", href: "/biz/settings", iconName: "Settings" },
] as const;
export const ADMIN_NAV = [
  { label: "Queue", href: "/queue", iconName: "ListOrdered" },
  { label: "Analytics", href: "/analytics", iconName: "BarChart3" },
  { label: "Businesses", href: "/businesses", iconName: "Store" },
  { label: "Subscriptions", href: "/subscriptions", iconName: "BadgeCheck" },
  { label: "Tickets", href: "/tickets", iconName: "Ticket" },
] as const;

export const STAMPS_PER_CARD_DEFAULT = 8;
export const SUPPORT_EMAIL = "support@perklyph.com";
