"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { StatusPopup } from "@/components/ui/status-popup";
import { ERROR, getSignUpErrorMessage, INFO, SUCCESS } from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

export function BusinessSignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupState, setPopupState] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToBusinessLogin?: boolean;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
    redirectToBusinessLogin: false,
  });

  function showPopup(params: {
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
    redirectToBusinessLogin?: boolean;
  }) {
    setPopupState({ open: true, ...params });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const ownerName = String(formData.get("ownerName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const didAcceptTerms = formData.get("terms") === "on";

    if (!didAcceptTerms) {
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
            role: "business_owner",
            full_name: ownerName,
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

      // Ensure this flow always requires manual login after registration.
      if (data.session) {
        await supabase.auth.signOut();
      }

      showPopup({
        variant: "success",
        ...SUCCESS.ACCOUNT_CREATED,
        redirectToBusinessLogin: true,
      });
    } catch {
      showPopup({ variant: "error", ...ERROR.GENERIC });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-6 text-[#322D45] sm:px-6 sm:py-8">
      <section
        className="mx-auto flex w-full max-w-[402px] flex-col"
        aria-labelledby="registration-title"
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
        </header>

        <article className="mt-3 rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_18px_45px_rgba(50,45,69,0.09)] sm:p-6">
          <div className="mb-5">
            <h1
              id="registration-title"
              className="font-heading text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
            >
              Register your business
            </h1>
            <p className="mt-1.5 text-[13px] leading-5 text-[#6F697F]">
              Tell us about your business to get started.
            </p>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="owner-name"
                className="mb-1.5 block text-[12px] font-medium text-[#595269]"
              >
                Owner / Representative name
              </label>
              <input
                id="owner-name"
                name="ownerName"
                type="text"
                autoComplete="name"
                required
                placeholder="e.g. Maria Santos"
                className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
              />
            </div>

            <div>
              <label
                htmlFor="business-email"
                className="mb-1.5 block text-[12px] font-medium text-[#595269]"
              >
                Business email
              </label>
              <input
                id="business-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@business.com"
                className="h-11 w-full rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 text-[14px] text-[#322D45] outline-none transition placeholder:text-[#938DA3] focus:border-[#76C9AA] focus:ring-2 focus:ring-[#9FE0C7]/70"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12px] font-medium text-[#595269]"
              >
                Password
              </label>
              <div className="grid h-11 grid-cols-[1fr_44px] items-center rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] transition focus-within:border-[#76C9AA] focus-within:ring-2 focus-within:ring-[#9FE0C7]/70">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                  className="h-full min-w-0 rounded-l-2xl bg-transparent pl-4 pr-1 text-[14px] text-[#322D45] outline-none placeholder:text-[#938DA3]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6F697F] outline-none transition hover:bg-white/60 hover:text-[#322D45] focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye aria-hidden="true" className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-[12px] font-medium text-[#595269]"
              >
                Confirm password
              </label>
              <div className="grid h-11 grid-cols-[1fr_44px] items-center rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] transition focus-within:border-[#76C9AA] focus-within:ring-2 focus-within:ring-[#9FE0C7]/70">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmation ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Re-enter your password"
                  className="h-full min-w-0 rounded-l-2xl bg-transparent pl-4 pr-1 text-[14px] text-[#322D45] outline-none placeholder:text-[#938DA3]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmation((visible) => !visible)}
                  aria-label={
                    showConfirmation
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  aria-pressed={showConfirmation}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#6F697F] outline-none transition hover:bg-white/60 hover:text-[#322D45] focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
                >
                  {showConfirmation ? (
                    <EyeOff aria-hidden="true" className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye aria-hidden="true" className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <label className="mt-0.5 flex cursor-pointer items-start gap-2.5 rounded-xl outline-none focus-within:ring-2 focus-within:ring-[#9FE0C7]">
              <input
                type="checkbox"
                name="terms"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="peer sr-only"
              />
              <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border border-[#AAA4B9] bg-[#F2F0F9] text-transparent transition peer-checked:border-[#78C9AB] peer-checked:bg-[#9FE0C7] peer-checked:text-[#322D45]">
                <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="text-[12px] leading-[19px] text-[#6F697F]">
                I agree to the{" "}
                <a
                  href="#terms"
                  className="font-medium text-[#3E9676] underline decoration-[#9FE0C7] underline-offset-2 hover:text-[#28775A]"
                >
                  Terms &amp; Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-0.5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-5 text-[14px] font-medium text-[#322D45] shadow-[0_7px_0_rgba(111,182,155,0.18)] outline-none transition hover:bg-[#8FD8BC] active:translate-y-0.5 active:shadow-[0_4px_0_rgba(111,182,155,0.18)] focus-visible:ring-2 focus-visible:ring-[#322D45] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E4DFF5] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <Check aria-hidden="true" className="h-[17px] w-[17px] animate-pulse" />
              ) : (
                <LockKeyhole aria-hidden="true" className="h-[16px] w-[16px]" />
              )}
              <span>{isSubmitting ? "Creating account..." : "Continue"}</span>
            </button>
          </form>
        </article>

        <p className="mt-5 text-center text-[13px] text-[#6F697F]">
          <span>Already have an account? </span>
          <Link
            href="/business-login"
            className="font-medium text-[#3E9676] underline decoration-[#9FE0C7] underline-offset-3 hover:text-[#28775A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7]"
          >
            Log in
          </Link>
        </p>
      </section>

      <StatusPopup
        open={popupState.open}
        variant={popupState.variant}
        title={popupState.title}
        subtitle={popupState.subtitle}
        buttonLabel={
          popupState.redirectToBusinessLogin ? "Back to Business Portal" : "Okay"
        }
        onConfirm={() => {
          const shouldRedirectToBusinessLogin = popupState.redirectToBusinessLogin;
          setPopupState((prev) => ({ ...prev, open: false }));

          if (shouldRedirectToBusinessLogin) {
            router.push("/business-login");
            router.refresh();
          }
        }}
      />
    </main>
  );
}
