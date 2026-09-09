export const business = {
  id: "biz_brew_bean_001",
  name: "Brew & Bean",
  slug: "brew-and-bean",
  category: "Coffee Shop",
  description:
    "Neighborhood specialty coffee in Makati — pour-overs, pastries, and a warm corner seat.",
  logoUrl: "/stamp-texture.svg",
  coverUrl: null as string | null,
  address: "123 Jupiter St, Makati City, Metro Manila",
  city: "Makati",
  phone: "+63 917 555 0142",
  email: "hello@brewandbean.ph",
  isActive: true,
  createdAt: "2025-03-12T08:00:00.000Z",
};

export const stampCard = {
  id: "card_bb_classic_8",
  businessId: business.id,
  title: "Classic Coffee Card",
  description: "Collect 8 stamps, get a free handcrafted drink of your choice.",
  totalStamps: 8,
  stampLabel: "Coffee",
  rewardTitle: "Free Handcrafted Drink",
  rewardDescription: "Any espresso-based drink up to ₱180.",
  backgroundColor: "#E4DFF5",
  stampColor: "#9FE0C7",
  isActive: true,
  expiresAt: null as string | null,
  createdAt: "2025-04-01T10:00:00.000Z",
};

export const membership = {
  id: "mem_user_bb_001",
  userId: "user_test_maya_01",
  userName: "Maya Santos",
  userEmail: "maya.santos@email.com",
  businessId: business.id,
  stampCardId: stampCard.id,
  currentStamps: 4,
  totalStampsEarned: 12,
  status: "active" as const,
  joinedAt: "2025-11-20T14:30:00.000Z",
  lastStampAt: "2026-07-28T09:15:00.000Z",
};

export const rewards = [
  {
    id: "rew_001",
    membershipId: membership.id,
    stampCardId: stampCard.id,
    businessId: business.id,
    businessName: business.name,
    title: "Free Handcrafted Drink",
    status: "ready" as const,
    earnedAt: "2026-07-15T11:00:00.000Z",
    expiresAt: "2026-09-15T11:00:00.000Z",
    claimedAt: null as string | null,
  },
  {
    id: "rew_002",
    membershipId: membership.id,
    stampCardId: stampCard.id,
    businessId: business.id,
    businessName: business.name,
    title: "Free Handcrafted Drink",
    status: "pending" as const,
    earnedAt: "2026-08-01T16:20:00.000Z",
    expiresAt: "2026-10-01T16:20:00.000Z",
    claimedAt: null as string | null,
  },
  {
    id: "rew_003",
    membershipId: membership.id,
    stampCardId: stampCard.id,
    businessId: business.id,
    businessName: business.name,
    title: "Free Handcrafted Drink",
    status: "claimed" as const,
    earnedAt: "2026-05-10T10:00:00.000Z",
    expiresAt: "2026-07-10T10:00:00.000Z",
    claimedAt: "2026-05-18T08:45:00.000Z",
  },
];

export const staffAccount = {
  id: "staff_bb_barista_01",
  businessId: business.id,
  userId: "user_staff_juan_01",
  name: "Juan Dela Cruz",
  email: "juan@brewandbean.ph",
  role: "barista" as const,
  pinCode: "4821",
  isActive: true,
  createdAt: "2025-06-01T09:00:00.000Z",
};

export const subscription = {
  id: "sub_bb_pro_001",
  businessId: business.id,
  plan: "pro" as const,
  status: "active" as const,
  billingCycle: "monthly" as const,
  pricePhp: 1499,
  currentPeriodStart: "2026-07-12T00:00:00.000Z",
  currentPeriodEnd: "2026-08-12T00:00:00.000Z",
  cancelAtPeriodEnd: false,
  maxStampCards: 10,
  maxStaff: 15,
};

export const supportTicket = {
  id: "tkt_2026_0842",
  businessId: business.id,
  businessName: business.name,
  submittedBy: "Ana Reyes",
  submitterEmail: "ana@brewandbean.ph",
  subject: "Staff PIN reset for afternoon shift",
  message:
    "Hi PerklyPh team — two of our baristas forgot their scan PINs after the tablet wipe. Can you reset staff accounts for Juan and Kim? We need them ready before Friday rush.",
  category: "account_access" as const,
  status: "open" as const,
  priority: "medium" as const,
  createdAt: "2026-08-03T07:42:00.000Z",
  updatedAt: "2026-08-03T07:42:00.000Z",
};
