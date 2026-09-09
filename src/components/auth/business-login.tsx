"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Store } from "lucide-react";
import { getPostLoginRedirect, normalizeRole, type ProfileRole } from "@/lib/auth/roles";
import { ERROR, getLoginErrorMessage } from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

export function BusinessLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorText("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setErrorText(getLoginErrorMessage(error?.message).subtitle);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("id", data.user.id)
        .maybeSingle<{
          role: ProfileRole;
          onboarding_completed: boolean | null;
        }>();

      const { data: roleFromRpc } = await supabase.rpc("current_user_role");

      const resolvedRole =
        normalizeRole(profile?.role) ??
        normalizeRole(roleFromRpc as string | null) ??
        normalizeRole(data.user.user_metadata?.role);

      if (resolvedRole !== "business_owner") {
        await supabase.auth.signOut();
        setErrorText(
          "This account is not a business owner account. Please use the customer login.",
        );
        return;
      }

      router.push(
        getPostLoginRedirect({
          role: resolvedRole,
          onboardingCompleted: profile?.onboarding_completed,
        }),
      );
      router.refresh();
    } catch {
      setErrorText(ERROR.LOGIN_CONFIG.subtitle);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#F7F8FB] px-6 py-8 text-[#322D45] sm:px-8">
      <div
        aria-hidden="true"
        className="absolute -right-16 top-24 h-44 w-44 rounded-full bg-[#FFC9A3]/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 bottom-24 h-52 w-52 rounded-full bg-[#9FE0C7]/20 blur-3xl"
      />

      <section className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[402px] flex-col items-center">
        <header className="flex flex-col items-center">
          <h1 className="font-heading text-[27px] font-bold tracking-[-0.055em] text-[#322D45]">
            <span>PerklyPh</span>
          </h1>
          <p className="mt-3 rounded-full bg-[#FFC9A3] px-4 py-1.5 text-xs font-medium tracking-[0.03em] text-[#322D45] shadow-[0_3px_0_rgba(50,45,69,0.08)]">
            <span>Business Portal</span>
          </p>
        </header>

        <figure
          className="mt-8 flex flex-col items-center"
          aria-label="PerklyPh storefront illustration"
        >
          <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[28px] border border-[#B9B4C9]/45 bg-white shadow-[0_12px_28px_rgba(50,45,69,0.07)]">
            <div
              aria-hidden="true"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#FFC9A3]"
            />
            <Store aria-hidden="true" className="h-11 w-11 stroke-[1.5] text-[#322D45]" />
          </div>
          <figcaption className="sr-only">
            <span>A simple storefront representing the PerklyPh business portal.</span>
          </figcaption>
        </figure>

        <section
          className="mt-8 w-full rounded-[20px] border border-white/70 bg-[#E4DFF5] p-6 shadow-[0_18px_45px_rgba(50,45,69,0.10)] sm:p-7"
          aria-labelledby="business-login-title"
        >
          <div className="mb-6">
            <h2
              id="business-login-title"
              className="font-heading text-[26px] font-semibold tracking-[-0.035em] text-[#322D45]"
            >
              <span>Welcome back</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#625D73]">
              <span>Sign in to manage rewards and grow your business.</span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="business-email"
                className="mb-2 block text-sm font-medium text-[#4B465D]"
              >
                <span>Business email</span>
              </label>
              <input
                id="business-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@yourbusiness.com"
                className="h-14 w-full rounded-2xl border border-[#B9B4C9] bg-white px-4 text-[15px] text-[#322D45] outline-none transition placeholder:text-[#918BA3] hover:border-[#8F89A0] focus:border-[#72CDAA] focus:ring-4 focus:ring-[#9FE0C7]/25"
              />
            </div>

            <div>
              <label
                htmlFor="business-password"
                className="mb-2 block text-sm font-medium text-[#4B465D]"
              >
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="business-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-2xl border border-[#B9B4C9] bg-white px-4 pr-14 text-[15px] text-[#322D45] outline-none transition placeholder:text-[#918BA3] hover:border-[#8F89A0] focus:border-[#72CDAA] focus:ring-4 focus:ring-[#9FE0C7]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#6E687F] transition hover:bg-[#F7F8FB] hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72CDAA]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <Eye aria-hidden="true" className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-0.5">
              <a
                href="#forgot-password"
                className="rounded-md text-sm font-medium text-[#3E9C79] underline-offset-4 transition hover:text-[#28775B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72CDAA]"
              >
                <span>Forgot password?</span>
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-14 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-5 text-[15px] font-medium text-[#322D45] shadow-[0_7px_0_#7AC7AA] transition hover:-translate-y-0.5 hover:bg-[#A9E7CF] hover:shadow-[0_9px_0_#7AC7AA] active:translate-y-1 active:shadow-[0_3px_0_#7AC7AA] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#72CDAA]/35 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span>{isSubmitting ? "Logging in..." : "Log In to Business Portal"}</span>
            </button>

            {errorText ? (
              <p
                className="text-center text-[12px] leading-5 text-[#8E3A4B]"
                role="alert"
              >
                {errorText}
              </p>
            ) : null}
          </form>
        </section>

        <p className="mt-7 pb-2 text-center text-sm leading-6 text-[#625D73]">
          <span>New to PerklyPh? </span>
          <Link
            href="/business-signup"
            className="font-medium text-[#3E9C79] underline-offset-4 transition hover:text-[#28775B] hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72CDAA]"
          >
            <span>Register your business</span>
          </Link>
        </p>

        <p className="text-center text-sm leading-6 text-[#625D73]">
          <span>Are you a customer? </span>
          <Link
            href="/"
            className="font-medium text-[#3E9C79] underline-offset-4 transition hover:text-[#28775B] hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#72CDAA]"
          >
            <span>Go to Customer Login</span>
          </Link>
        </p>
      </section>
    </main>
  );
}
