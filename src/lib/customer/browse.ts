import type { CustomerStampCardMilestone } from "@/lib/customer/stamp-cards";

export type BrowseBusinessListItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  initials: string;
  logoColor: string;
  stampCount: number;
};

export type BrowseLandingCard = {
  id: string;
  name: string;
  totalStamps: number;
  expiryLabel: string;
  rules: string | null;
  cardCode: string;
  milestones: CustomerStampCardMilestone[];
  isJoined: boolean;
  membershipId: string | null;
};

export type BrowseBusinessLanding = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  initials: string;
  logoColor: string;
  hours: string[];
  cards: BrowseLandingCard[];
};
