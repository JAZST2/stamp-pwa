"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateCustomerProfileAction } from "@/app/(customer)/settings/actions";
import { CustomerTopBar } from "@/components/customer/customer-top-bar";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/ui/phone-field";
import { StatusPopup } from "@/components/ui/status-popup";
import { TextField } from "@/components/ui/text-field";
import { parsePhMobileDigits } from "@/lib/display";

type CustomerEditProfileScreenProps = {
  fullName: string;
  email: string;
  phone: string | null;
};

export function CustomerEditProfileScreen({
  fullName,
  email,
  phone,
}: CustomerEditProfileScreenProps) {
  const router = useRouter();
  const [name, setName] = useState(fullName);
  const [phoneDigits, setPhoneDigits] = useState(parsePhMobileDigits(phone));
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const result = await updateCustomerProfileAction({
      fullName: name,
      phoneDigits,
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
      title: "Profile updated",
      subtitle: "Your name and mobile number are saved.",
    });
    router.refresh();
  };

  return (
    <>
      <CustomerTopBar title="Edit Profile" backHref="/settings" showProfile={false} />

      <main className="mx-auto w-full max-w-[402px] px-5 pb-32 pt-[calc(6rem+env(safe-area-inset-top))]">
        <p className="px-1 text-[14px] leading-6 text-[#6F697E]">
          Update the details customers and cashiers see on your pass.
        </p>
        <p className="mt-2 px-1 text-[13px] text-[#777186]">{email}</p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <TextField
            id="full-name"
            name="fullName"
            label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={80}
            autoComplete="name"
          />
          <PhoneField
            id="profile-mobile"
            name="mobile"
            label="Mobile number"
            value={phoneDigits}
            onChange={(event) => setPhoneDigits(event.target.value.replace(/\D/g, "").slice(0, 10))}
            required
          />
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </main>

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
    </>
  );
}
