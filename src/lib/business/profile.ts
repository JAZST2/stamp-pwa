import {
  emptyBusinessHours,
  type BusinessHours,
} from "@/lib/business/hours";

export type BusinessProfileDraft = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverPhotoUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  contactEmail: string;
  contactPhoneDigits: string;
  hours: BusinessHours;
};

export function emptyBusinessProfileDraft(): BusinessProfileDraft {
  return {
    name: "",
    slug: "",
    tagline: "",
    description: "",
    logoUrl: "",
    coverPhotoUrl: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    zipCode: "",
    country: "Philippines",
    contactEmail: "",
    contactPhoneDigits: "",
    hours: emptyBusinessHours(),
  };
}
