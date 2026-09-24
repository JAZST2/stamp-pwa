"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { updateBusinessProfileAction } from "@/app/(business)/biz/settings/actions";
import { BusinessHoursEditor } from "@/components/business/settings/business-hours-editor";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/ui/phone-field";
import { StatusPopup } from "@/components/ui/status-popup";
import { TextField } from "@/components/ui/text-field";
import type { BusinessProfileDraft } from "@/lib/business/profile";
import { normalizeBusinessSlug } from "@/lib/display";

type BusinessEditProfileScreenProps = {
  initialDraft: BusinessProfileDraft;
};

export function BusinessEditProfileScreen({ initialDraft }: BusinessEditProfileScreenProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [popup, setPopup] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
  });

  const suggestedSlug = useMemo(
    () => normalizeBusinessSlug(draft.slug || draft.name),
    [draft.name, draft.slug],
  );

  const updateField = <K extends keyof BusinessProfileDraft>(
    key: K,
    value: BusinessProfileDraft[K],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const result = await updateBusinessProfileAction({
      ...draft,
      slug: suggestedSlug,
    });
    setIsSaving(false);

    if (!result.ok) {
      setPopup({
        open: true,
        variant: "error",
        title: "Unable to save profile",
        subtitle: result.error,
      });
      return;
    }

    setPopup({
      open: true,
      variant: "success",
      title: "Business profile updated",
      subtitle: "Your landing page and shop details now use the latest information.",
    });
    router.refresh();
  };

  return (
    <section className="pt-[max(16px,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={() => router.push("/biz/settings")}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4DFF5] bg-white"
        aria-label="Back to settings"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777187]">
        Business
      </p>
      <h1 className="mt-2 font-sora text-[26px] font-semibold tracking-[-0.035em] text-[#322D45]">
        Edit Profile
      </h1>
      <p className="mt-2 text-[14px] leading-6 text-[#6F697E]">
        Manage the same core fields from your registration details.
      </p>

      <form className="mt-6 space-y-4 pb-8" onSubmit={(event) => void handleSubmit(event)}>
        <TextField
          id="tagline"
          name="tagline"
          label="Tagline"
          value={draft.tagline}
          onChange={(event) => updateField("tagline", event.target.value)}
        />
        <label className="block px-1 text-[13px] font-medium text-[#5F596F]" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={draft.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          className="h-auto min-h-28 w-full rounded-2xl border border-[#CBC5DB] bg-[#F7F8FB] px-4 py-3 text-[15px] text-[#322D45] outline-none placeholder:text-[#9A94AA] focus:border-[#68C9A3] focus:ring-4 focus:ring-[#9FE0C7]/30"
        />
        <TextField
          id="logo-url"
          name="logoUrl"
          label="Logo URL"
          type="url"
          value={draft.logoUrl}
          onChange={(event) => updateField("logoUrl", event.target.value)}
        />
        <BusinessHoursEditor hours={draft.hours} onChange={(hours) => updateField("hours", hours)} />
        <TextField
          id="contact-email"
          name="contactEmail"
          label="Contact email"
          type="email"
          value={draft.contactEmail}
          onChange={(event) => updateField("contactEmail", event.target.value)}
          required
        />
        <PhoneField
          id="contact-phone"
          name="contactPhone"
          label="Contact phone"
          value={draft.contactPhoneDigits}
          onChange={(event) =>
            updateField("contactPhoneDigits", event.target.value.replace(/\D/g, "").slice(0, 10))
          }
          required
        />
        <TextField
          id="address-line1"
          name="addressLine1"
          label="Address line 1"
          value={draft.addressLine1}
          onChange={(event) => updateField("addressLine1", event.target.value)}
          required
        />
        <TextField
          id="address-line2"
          name="addressLine2"
          label="Address line 2"
          value={draft.addressLine2}
          onChange={(event) => updateField("addressLine2", event.target.value)}
        />
        <TextField
          id="city"
          name="city"
          label="City"
          value={draft.city}
          onChange={(event) => updateField("city", event.target.value)}
          required
        />
        <TextField
          id="province"
          name="province"
          label="Province"
          value={draft.province}
          onChange={(event) => updateField("province", event.target.value)}
          required
        />
        <TextField
          id="zip-code"
          name="zipCode"
          label="Zip code"
          value={draft.zipCode}
          onChange={(event) => updateField("zipCode", event.target.value)}
          required
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save business profile"}
        </Button>
      </form>

      <StatusPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        subtitle={popup.subtitle}
        onConfirm={() =>
          setPopup((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />
    </section>
  );
}
