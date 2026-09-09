"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppBrand } from "@/components/brand/app-brand";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { StampCardIllustration } from "@/components/auth/stamp-card-illustration";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextLink } from "@/components/ui/text-link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import {
  getPostLoginRedirect,
  normalizeRole,
  type ProfileRole,
} from "@/lib/auth/roles";
import { ERROR, getLoginErrorMessage } from "@/lib/messages";
import { createClient } from "@/lib/supabase/client";

export function CustomerLogin() {
  const router = useRouter();
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

      if (resolvedRole !== "customer") {
        await supabase.auth.signOut();
        setErrorText(
          "This account is not a customer account. Please use the Business Portal login.",
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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F7F8FB] px-5 py-8 text-[#322D45] sm:flex sm:items-center sm:justify-center sm:py-10">
      <section
        className="mx-auto flex min-h-[810px] w-full max-w-[402px] flex-col items-center sm:min-h-0"
        aria-labelledby="login-title"
      >
        <AppBrand name={APP_NAME} tagline={APP_TAGLINE} />

        <StampCardIllustration />

        <AuthCard className="mt-5" aria-labelledby="login-title">
          <AuthHeader
            titleId="login-title"
            title="Welcome back"
            description="Log in to keep collecting your rewards."
          />

          <form className="mt-6" onSubmit={handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              passwordToggle
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              containerClassName="mt-4"
            />

            <div className="mt-3 flex justify-end">
              <TextLink href="#forgot-password">Forgot password?</TextLink>
            </div>

            <Button type="submit" className="mt-5" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>

            {errorText ? (
              <p
                className="mt-3 text-center text-[12px] leading-5 text-[#8E3A4B]"
                role="alert"
              >
                {errorText}
              </p>
            ) : null}
          </form>
        </AuthCard>

        <p className="mt-6 text-center text-[14px] leading-6 text-[#746E86]">
          <span>Don&apos;t have an account? </span>
          <TextLink href="/signup" variant="inline">
            Sign up
          </TextLink>
        </p>

        <p className="mt-2 text-center text-[14px] leading-6 text-[#746E86]">
          <span>Are you a business owner? </span>
          <TextLink href="/business-login" variant="inline">
            Login to Business Portal
          </TextLink>
        </p>
      </section>
    </main>
  );
}
