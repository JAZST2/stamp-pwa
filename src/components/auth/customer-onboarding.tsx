"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppBrand } from "@/components/brand/app-brand";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/ui/phone-field";
import { StatusPopup } from "@/components/ui/status-popup";
import { APP_NAME, APP_SIGNUP_TAGLINE } from "@/lib/constants";
import { buildPersonalShortCode, formatPhMobile } from "@/lib/customer/personal-code";
import { ERROR, INFO, SUCCESS } from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

type CustomerOnboardingProps = {
  fullName: string;
};

export function CustomerOnboarding({ fullName }: CustomerOnboardingProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToHome?: boolean;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
    redirectToHome: false,
  });

  function showPopup(params: {
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToHome?: boolean;
  }) {
    setPopupState({ open: true, ...params });
  }

  function getOnboardingSaveErrorMessage(error: { code?: string; message?: string }) {
    if (error.code === "42501") {
      return {
        title: "Profile Permission Needed",
        subtitle:
          "Your account is ready, but this project still needs profile update permission in Supabase. Please apply the SQL fix, then try again.",
      };
    }

    return ERROR.ONBOARDING_SAVE_FAILED;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawMobile = String(formData.get("mobile") ?? "").trim();
    const mobileDigits = rawMobile.replace(/\D/g, "").slice(0, 10);

    if (!/^\d{10}$/.test(mobileDigits)) {
      showPopup({
        variant: "info",
        ...INFO.INVALID_PHONE,
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

      const phone = formatPhMobile(mobileDigits);

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const personalShortCode = buildPersonalShortCode(fullName, mobileDigits);
        const { error } = await supabase
          .from("profiles")
          .update({
            phone,
            personal_short_code: personalShortCode,
            onboarding_completed: true,
          })
          .eq("id", user.id);

        if (!error) {
          await supabase.auth.updateUser({
            data: {
              phone,
              personal_short_code: personalShortCode,
              onboarding_completed: true,
            },
          });

          showPopup({
            variant: "success",
            ...SUCCESS.ONBOARDING_COMPLETED,
            redirectToHome: true,
          });
          return;
        }

        if (
          error.code === "23505" &&
          error.message.toLowerCase().includes("personal_short_code")
        ) {
          continue;
        }

        showPopup({
          variant: "error",
          ...getOnboardingSaveErrorMessage(error),
        });
        return;
      }

      showPopup({
        variant: "error",
        ...ERROR.ONBOARDING_SAVE_FAILED,
      });
    } catch {
      showPopup({
        variant: "error",
        ...ERROR.ONBOARDING_SAVE_FAILED,
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
    <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-7 text-[#322D45] sm:grid sm:place-items-center sm:py-10">
      <section className="mx-auto w-full max-w-[402px]" aria-labelledby="onboarding-title">
        <AppBrand
          variant="signup"
          name={APP_NAME}
          tagline={APP_SIGNUP_TAGLINE}
          href="/"
        />

        <article className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_22px_55px_-32px_rgba(50,45,69,0.5)] sm:p-6">
          <div className="mb-5">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#716B82]">
              <span
                className="h-2 w-2 rounded-full bg-[#FFC9A3]"
                aria-hidden="true"
              />
              <span>Welcome</span>
            </p>
            <h1
              id="onboarding-title"
              className="font-heading text-[24px] font-semibold leading-tight tracking-[-0.035em]"
            >
              <span>{fullName || "Customer"}</span>
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[#716B82]">
              Add your mobile number to finish onboarding and enable your backup
              short code.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <PhoneField required placeholder="Mobile number" />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 min-h-12 h-auto rounded-full bg-[#9FE0C7] px-5 text-[15px] font-semibold text-[#322D45] shadow-[0_8px_20px_-12px_rgba(50,45,69,0.7)] transition hover:-translate-y-0.5 hover:bg-[#8BD8BA] hover:shadow-[0_12px_24px_-14px_rgba(50,45,69,0.75)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#74CFAE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4DFF5] active:translate-y-0"
            >
              {isSubmitting ? "Saving..." : "Proceed"}
            </Button>
          </form>
        </article>

        <div className="mt-5 text-center">
          <button
            type="button"
            className="font-semibold text-[#3F9478] underline decoration-transparent underline-offset-4 transition hover:decoration-[#9FE0C7] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </section>

      <StatusPopup
        open={popupState.open}
        variant={popupState.variant}
        title={popupState.title}
        subtitle={popupState.subtitle}
        buttonLabel="Okay"
        onConfirm={() => {
          const shouldRedirect = popupState.redirectToHome;
          setPopupState((prev) => ({ ...prev, open: false }));
          if (shouldRedirect) {
            router.push("/home");
            router.refresh();
          }
        }}
      />
    </main>
  );
}
