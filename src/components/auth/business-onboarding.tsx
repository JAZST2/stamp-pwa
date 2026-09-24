"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import { PhoneField } from "@/components/ui/phone-field";
import { StatusPopup } from "@/components/ui/status-popup";
import { ERROR, INFO, SUCCESS } from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

type BusinessOnboardingProps = {
  initialContactEmail: string;
};

type BusinessFormValues = {
  business_name: string;
  tagline: string;
  description: string;
  logo_url: string;
  cover_photo_url: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  zip_code: string;
  country: string;
  contact_email: string;
  contact_phone: string;
  owner_representative_phone: string;
};

const TOTAL_STEPS = 3;
const MAX_ERROR_DETAIL_LENGTH = 220;

function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("63")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+63${digits.slice(1)}`;
  }
  return `+63${digits}`;
}

function compactErrorDetail(error: { message?: string; details?: string; hint?: string }) {
  const detail = [error.message, error.details, error.hint].filter(Boolean).join(" — ");
  if (!detail) {
    return "";
  }
  return detail.length > MAX_ERROR_DETAIL_LENGTH
    ? `${detail.slice(0, MAX_ERROR_DETAIL_LENGTH)}...`
    : detail;
}

export function BusinessOnboarding({ initialContactEmail }: BusinessOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [values, setValues] = useState<BusinessFormValues>({
    business_name: "",
    tagline: "",
    description: "",
    logo_url: "",
    cover_photo_url: "",
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    zip_code: "",
    country: "Philippines",
    contact_email: initialContactEmail,
    contact_phone: "",
    owner_representative_phone: "",
  });
  const [popupState, setPopupState] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToDashboard?: boolean;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
    redirectToDashboard: false,
  });

  const suggestedSlug = useMemo(
    () => normalizeSlug(values.business_name),
    [values.business_name],
  );

  function showPopup(params: {
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToDashboard?: boolean;
  }) {
    setPopupState({ open: true, ...params });
  }

  function updateValue<K extends keyof BusinessFormValues>(
    key: K,
    nextValue: BusinessFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: nextValue }));
  }

  function validateStep(currentStep: number): boolean {
    if (currentStep === 1) {
      if (!values.business_name.trim()) {
        showPopup({
          variant: "info",
          title: "Business Name Required",
          subtitle: "Please enter your business name to continue.",
        });
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!values.address_line1.trim()) {
        showPopup({
          variant: "info",
          title: "Address Required",
          subtitle: "Please enter address line 1 to continue.",
        });
        return false;
      }
      if (!values.city.trim() || !values.province.trim()) {
        showPopup({
          variant: "info",
          title: "Location Required",
          subtitle: "City and province are required to continue.",
        });
        return false;
      }
      if (!values.zip_code.trim() || !values.country.trim()) {
        showPopup({
          variant: "info",
          title: "Postal Details Required",
          subtitle: "Zip code and country are required to continue.",
        });
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!values.contact_email.trim()) {
        showPopup({
          variant: "info",
          title: "Contact Email Required",
          subtitle: "Please enter a contact email for your business.",
        });
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email.trim())) {
        showPopup({
          variant: "info",
          title: "Invalid Contact Email",
          subtitle: "Please enter a valid contact email address.",
        });
        return false;
      }
      if (!values.contact_phone.trim() || !values.owner_representative_phone.trim()) {
        showPopup({
          variant: "info",
          title: "Phone Number Required",
          subtitle:
            "Contact phone and owner/representative phone are required to continue.",
        });
        return false;
      }
      if (
        values.contact_phone.replace(/\D/g, "").length !== 10 ||
        values.owner_representative_phone.replace(/\D/g, "").length !== 10
      ) {
        showPopup({
          variant: "info",
          ...INFO.INVALID_PHONE,
        });
        return false;
      }
      return true;
    }

    return true;
  }

  function getBusinessSaveErrorMessage(error: { code?: string; message?: string }) {
    if (error.code === "42501") {
      return {
        title: "Permission Needed",
        subtitle:
          "Your account is ready, but this project still needs insert permission for businesses. Please apply the SQL policy fix, then try again.",
      };
    }

    if (
      error.code === "23505" &&
      error.message?.toLowerCase().includes("slug")
    ) {
      return {
        title: "Slug Already Used",
        subtitle:
          "That business slug is already taken. Please edit the business name and try again.",
      };
    }

    return ERROR.BUSINESS_ONBOARDING_SAVE_FAILED;
  }

  async function insertBusinessWithSchemaFallback(
    supabase: ReturnType<typeof createClient>,
    userId: string,
    businessPayload: {
      business_name: string;
      slug: string;
      tagline: string | null;
      description: string | null;
      logo_url: string | null;
      cover_photo_url: string | null;
      address_line1: string;
      address_line2: string | null;
      city: string;
      province: string;
      zip_code: string;
      country: string;
      contact_email: string;
      contact_phone: string;
    },
  ) {
    type BusinessInsertAttempt = {
      slug: string;
      tagline: string | null;
      description: string | null;
      logo_url: string | null;
      address_line1: string;
      address_line2: string | null;
      city: string;
      province: string;
      zip_code: string;
      country: string;
      business_name?: string;
      name?: string;
      cover_photo_url?: string | null;
      cover_url?: string | null;
      contact_email?: string;
      contact_phone?: string;
      email?: string;
      phone?: string;
      owner_id?: string;
      user_id?: string;
      profile_id?: string;
      created_by?: string;
    };

    const nameVariants = [
      { business_name: businessPayload.business_name },
      { name: businessPayload.business_name },
    ];
    const coverVariants = [
      { cover_photo_url: businessPayload.cover_photo_url },
      { cover_url: businessPayload.cover_photo_url },
    ];
    const contactVariants = [
      {
        contact_email: businessPayload.contact_email,
        contact_phone: businessPayload.contact_phone,
      },
      {
        email: businessPayload.contact_email,
        phone: businessPayload.contact_phone,
      },
    ];
    const ownerVariants = [
      {},
      { owner_id: userId },
      { user_id: userId },
      { profile_id: userId },
      { created_by: userId },
    ];

    const stableFields = {
      slug: businessPayload.slug,
      tagline: businessPayload.tagline,
      description: businessPayload.description,
      logo_url: businessPayload.logo_url,
      address_line1: businessPayload.address_line1,
      address_line2: businessPayload.address_line2,
      city: businessPayload.city,
      province: businessPayload.province,
      zip_code: businessPayload.zip_code,
      country: businessPayload.country,
    };

    let lastError: {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    } | null = null;
    const attemptedPayloads = new Set<string>();

    for (const nameFields of nameVariants) {
      for (const coverFields of coverVariants) {
        for (const contactFields of contactVariants) {
          for (const ownerFields of ownerVariants) {
            const payload: BusinessInsertAttempt = {
              ...stableFields,
              ...nameFields,
              ...coverFields,
              ...contactFields,
              ...ownerFields,
            };

            const payloadSignature = JSON.stringify(Object.keys(payload).sort());
            if (attemptedPayloads.has(payloadSignature)) {
              continue;
            }
            attemptedPayloads.add(payloadSignature);

            // Intentionally dynamic to support multiple column names while rolling schema changes.
            const { error } = await supabase
              .from("businesses")
              .insert(payload as never);
            if (!error) {
              return { error: null };
            }

            lastError = error;

            const message = error.message.toLowerCase();
            const isSchemaShapeIssue =
              error.code === "PGRST204" ||
              error.code === "42703" ||
              message.includes("column") ||
              message.includes("schema cache") ||
              message.includes("has no field");

            if (!isSchemaShapeIssue) {
              return { error };
            }
          }
        }
      }
    }

    return { error: lastError };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep((previous) => previous + 1);
      return;
    }

    const resolvedSlug = normalizeSlug(values.business_name);
    if (!resolvedSlug) {
      showPopup({
        variant: "info",
        title: "Slug Required",
        subtitle: "Please provide a valid business slug to continue.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        showPopup({
          variant: "error",
          ...ERROR.LOGIN_FAILED,
        });
        return;
      }

      const businessPayload = {
        business_name: values.business_name.trim(),
        slug: resolvedSlug,
        tagline: values.tagline.trim() || null,
        description: values.description.trim() || null,
        logo_url: values.logo_url.trim() || null,
        cover_photo_url: values.cover_photo_url.trim() || null,
        address_line1: values.address_line1.trim(),
        address_line2: values.address_line2.trim() || null,
        city: values.city.trim(),
        province: values.province.trim(),
        zip_code: values.zip_code.trim(),
        country: values.country.trim(),
        contact_email: values.contact_email.trim(),
        contact_phone: normalizePhone(values.contact_phone),
      };

      const { error: businessError } = await insertBusinessWithSchemaFallback(
        supabase,
        user.id,
        businessPayload,
      );

      if (businessError) {
        const baseMessage = getBusinessSaveErrorMessage(businessError);
        const detail = compactErrorDetail(businessError);
        showPopup({
          variant: "error",
          title: baseMessage.title,
          subtitle: detail
            ? `${baseMessage.subtitle}\n\nDetails: ${detail}`
            : baseMessage.subtitle,
        });
        return;
      }

      const ownerPhone = normalizePhone(values.owner_representative_phone);
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: ownerPhone,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (profileError) {
        showPopup({
          variant: "error",
          ...ERROR.ONBOARDING_SAVE_FAILED,
        });
        return;
      }

      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          phone: ownerPhone,
        },
      });

      showPopup({
        variant: "success",
        ...SUCCESS.BUSINESS_ONBOARDING_COMPLETED,
        redirectToDashboard: true,
      });
    } catch {
      showPopup({
        variant: "error",
        ...ERROR.BUSINESS_ONBOARDING_SAVE_FAILED,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-6 text-[#322D45] sm:px-6 sm:py-8">
      <section
        className="mx-auto flex w-full max-w-[402px] flex-col"
        aria-labelledby="business-onboarding-title"
      >
        <header className="flex flex-col items-center">
          <Link
            href="/"
            aria-label="PerklyPh home"
            className="font-heading text-[24px] font-bold tracking-[-0.04em] text-[#322D45] outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
          >
            PerklyPh
          </Link>
          <span className="mt-2 rounded-full bg-[#FFC9A3] px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-[#322D45]">
            Business Portal
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-4 text-[13px] font-semibold text-[#3F9478] underline decoration-transparent underline-offset-4 transition hover:decoration-[#9FE0C7] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7] disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </header>

        <p className="mt-5 px-1 font-mono text-[12px] leading-5 tracking-[0.02em] text-[#817B92]">
          Step {step} of {TOTAL_STEPS}
        </p>

        <article className="mt-3 rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_18px_45px_rgba(50,45,69,0.09)] sm:p-6">
          <div className="mb-5">
            <h1
              id="business-onboarding-title"
              className="font-heading text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
            >
              Complete business onboarding
            </h1>
            <p className="mt-1.5 text-[13px] leading-5 text-[#6F697F]">
              Add your business details in 3 quick steps.
            </p>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div>
                  <label
                    htmlFor="business-name"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Business name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="business-name"
                    type="text"
                    required
                    value={values.business_name}
                    onChange={(event) => updateValue("business_name", event.target.value)}
                    placeholder="e.g. Sinta Coffee"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                  <p className="mt-1.5 px-1 text-[11px] leading-5 text-[#817B92]">
                    Business slug:{" "}
                    <span className="font-mono text-[#625D73]">
                      {suggestedSlug || "will-generate-from-business-name"}
                    </span>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="tagline"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Tagline
                  </label>
                  <input
                    id="tagline"
                    type="text"
                    value={values.tagline}
                    onChange={(event) => updateValue("tagline", event.target.value)}
                    placeholder="Short brand message"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={values.description}
                    onChange={(event) => updateValue("description", event.target.value)}
                    placeholder="Tell customers about your business"
                    rows={3}
                    className="w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 py-3 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="logo-url"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Logo URL
                  </label>
                  <input
                    id="logo-url"
                    type="url"
                    value={values.logo_url}
                    onChange={(event) => updateValue("logo_url", event.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cover-url"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Cover photo URL
                  </label>
                  <input
                    id="cover-url"
                    type="url"
                    value={values.cover_photo_url}
                    onChange={(event) => updateValue("cover_photo_url", event.target.value)}
                    placeholder="https://example.com/cover.png"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div>
                  <label
                    htmlFor="address-line1"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Address Line 1 <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="address-line1"
                    type="text"
                    required
                    value={values.address_line1}
                    onChange={(event) => updateValue("address_line1", event.target.value)}
                    placeholder="House number, street, or building name"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address-line2"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Address Line 2 (optional)
                  </label>
                  <input
                    id="address-line2"
                    type="text"
                    value={values.address_line2}
                    onChange={(event) => updateValue("address_line2", event.target.value)}
                    placeholder="Apartment, suite, unit, floor"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    City <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={values.city}
                    onChange={(event) => updateValue("city", event.target.value)}
                    placeholder="City"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Province <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="province"
                    type="text"
                    required
                    value={values.province}
                    onChange={(event) => updateValue("province", event.target.value)}
                    placeholder="Province"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="zip-code"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Zip Code <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="zip-code"
                    type="text"
                    required
                    value={values.zip_code}
                    onChange={(event) => updateValue("zip_code", event.target.value)}
                    placeholder="Zip Code"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Country <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={values.country}
                    readOnly
                    aria-readonly="true"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#E9E6F4] px-4 text-[14px] text-[#322D45] outline-none"
                  />
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Contact email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={values.contact_email}
                    onChange={(event) => updateValue("contact_email", event.target.value)}
                    placeholder="you@business.com"
                    className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Contact phone <span aria-hidden="true">*</span>
                  </label>
                  <PhoneField
                    id="contact-phone"
                    name="contactPhone"
                    label="Contact phone"
                    required
                    value={values.contact_phone}
                    onInput={(event) =>
                      updateValue("contact_phone", event.currentTarget.value)
                    }
                    placeholder="9171234567"
                    containerClassName="min-h-11 rounded-2xl border-[#C8C2D7] bg-[#F2F0F9]"
                    className="text-[14px] text-[#322D45] placeholder:text-[#938DA3]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="owner-phone"
                    className="mb-1.5 block text-[12px] font-medium text-[#595269]"
                  >
                    Owner / Representative phone <span aria-hidden="true">*</span>
                  </label>
                  <PhoneField
                    id="owner-phone"
                    name="ownerRepresentativePhone"
                    label="Owner / Representative phone"
                    required
                    value={values.owner_representative_phone}
                    onInput={(event) =>
                      updateValue(
                        "owner_representative_phone",
                        event.currentTarget.value,
                      )
                    }
                    placeholder="9177654321"
                    containerClassName="min-h-11 rounded-2xl border-[#C8C2D7] bg-[#F2F0F9]"
                    className="text-[14px] text-[#322D45] placeholder:text-[#938DA3]"
                  />
                </div>
              </>
            ) : null}

            <div className="mt-0.5 flex items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((previous) => Math.max(1, previous - 1))}
                  className="flex h-12 w-[110px] items-center justify-center gap-1 rounded-full border border-[#B9B4C9] bg-white px-4 text-[14px] font-medium text-[#322D45] transition hover:bg-[#F7F8FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-5 text-[14px] font-medium text-[#322D45] shadow-[0_7px_0_rgba(111,182,155,0.18)] outline-none transition hover:bg-[#8FD8BC] active:translate-y-0.5 active:shadow-[0_4px_0_rgba(111,182,155,0.18)] focus-visible:ring-2 focus-visible:ring-[#322D45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4DFF5] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {step < TOTAL_STEPS ? (
                  <>
                    <span>Continue</span>
                    <ChevronRight className="h-[16px] w-[16px]" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-[16px] w-[16px]" aria-hidden="true" />
                    <span>{isSubmitting ? "Saving..." : "Complete setup"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </article>
      </section>

      <StatusPopup
        open={popupState.open}
        variant={popupState.variant}
        title={popupState.title}
        subtitle={popupState.subtitle}
        buttonLabel="Okay"
        onConfirm={() => {
          const shouldRedirect = popupState.redirectToDashboard;
          setPopupState((previous) => ({ ...previous, open: false }));
          if (shouldRedirect) {
            router.push("/business-status");
            router.refresh();
          }
        }}
      />
    </main>
  );
}
