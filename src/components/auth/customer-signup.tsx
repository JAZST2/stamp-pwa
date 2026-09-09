"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBrand } from "@/components/brand/app-brand";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { StatusPopup } from "@/components/ui/status-popup";
import { TextField } from "@/components/ui/text-field";
import { APP_NAME, APP_SIGNUP_TAGLINE } from "@/lib/constants";
import {
  ERROR,
  getSignUpErrorMessage,
  INFO,
  SUCCESS,
} from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

export function CustomerSignUp() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToLogin?: boolean;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
    redirectToLogin: false,
  });

  function showPopup(params: {
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToLogin?: boolean;
  }) {
    setPopupState({ open: true, ...params });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const acceptedTerms = formData.get("terms") === "on";

    if (!acceptedTerms) {
      showPopup({ variant: "info", ...INFO.TERMS_REQUIRED });
      return;
    }

    if (password !== confirmPassword) {
      showPopup({ variant: "error", ...ERROR.PASSWORD_MISMATCH });
      return;
    }

    if (password.length < 8) {
      showPopup({ variant: "info", ...INFO.WEAK_PASSWORD });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "customer",
            full_name: fullName,
          },
        },
      });

      if (error) {
        showPopup({
          variant: "error",
          ...getSignUpErrorMessage(error.message),
        });
        return;
      }

      // Supabase may return no explicit error for existing users depending on auth settings.
      const looksLikeExistingUser =
        !!data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0;

      if (looksLikeExistingUser) {
        showPopup({ variant: "error", ...ERROR.EMAIL_ALREADY_REGISTERED });
        return;
      }

      showPopup({
        variant: "success",
        ...SUCCESS.ACCOUNT_CREATED,
        redirectToLogin: true,
      });
    } catch {
      showPopup({ variant: "error", ...ERROR.GENERIC });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-7 text-[#322D45] sm:grid sm:place-items-center sm:py-10">
      <section className="mx-auto w-full max-w-[402px]" aria-labelledby="signup-title">
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
              <span>New member</span>
            </p>
            <h1
              id="signup-title"
              className="font-heading text-[24px] font-semibold leading-tight tracking-[-0.035em]"
            >
              <span>Create your account</span>
            </h1>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <TextField
              id="full-name"
              name="fullName"
              label="Full name"
              type="text"
              variant="plain"
              autoComplete="name"
              required
              placeholder="Full name"
            />

            <TextField
              id="email"
              name="email"
              label="Email address"
              type="email"
              variant="plain"
              autoComplete="email"
              required
              placeholder="Email address"
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              variant="plain"
              passwordToggle
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Password"
            />

            <TextField
              id="confirm-password"
              name="confirmPassword"
              label="Confirm password"
              variant="plain"
              passwordToggle
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Confirm password"
            />

            <CheckboxField id="terms" name="terms" required>
              I agree to the{" "}
              <a
                href="#terms"
                className="font-medium text-[#3F9478] underline decoration-[#9FE0C7] decoration-2 underline-offset-2 hover:text-[#322D45]"
              >
                <span>Terms &amp; Privacy Policy</span>
              </a>
            </CheckboxField>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 min-h-12 h-auto rounded-full bg-[#9FE0C7] px-5 text-[15px] font-semibold text-[#322D45] shadow-[0_8px_20px_-12px_rgba(50,45,69,0.7)] transition hover:-translate-y-0.5 hover:bg-[#8BD8BA] hover:shadow-[0_12px_24px_-14px_rgba(50,45,69,0.75)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#74CFAE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4DFF5] active:translate-y-0"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </article>

        <p className="mt-5 text-center text-[13px] text-[#716B82]">
          <span>Already have an account? </span>
          <Link
            href="/"
            className="font-semibold text-[#3F9478] underline decoration-transparent underline-offset-4 transition hover:decoration-[#9FE0C7] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
          >
            <span>Log in</span>
          </Link>
        </p>
      </section>

      <StatusPopup
        open={popupState.open}
        variant={popupState.variant}
        title={popupState.title}
        subtitle={popupState.subtitle}
        buttonLabel="Okay"
        onConfirm={() => {
          const shouldRedirectToLogin = popupState.redirectToLogin;
          setPopupState((prev) => ({ ...prev, open: false }));

          if (shouldRedirectToLogin) {
            router.push("/");
            router.refresh();
          }
        }}
      />
    </main>
  );
}
