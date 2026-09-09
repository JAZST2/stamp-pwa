import { AlertCircle, Ban, Clock3 } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import type { BusinessStatus } from "@/lib/business/status";

type BusinessStatusScreenProps = {
  status: BusinessStatus | null;
};

const STATUS_COPY: Record<
  Exclude<BusinessStatus, "active">,
  {
    title: string;
    subtitle: string;
    icon: typeof Clock3;
    iconClassName: string;
  }
> = {
  pending: {
    title: "Approval Pending",
    subtitle:
      "Your business profile is submitted and currently waiting for approval. You will be able to access the Business Dashboard once your account is active.",
    icon: Clock3,
    iconClassName: "text-[#625D73]",
  },
  suspended: {
    title: "Account Suspended",
    subtitle:
      "Your business account is currently suspended. Please contact our team so we can help restore access.",
    icon: Ban,
    iconClassName: "text-[#B44A5F]",
  },
  declined: {
    title: "Application Declined",
    subtitle:
      "Your business application was declined. Please contact our team for more details or to request a review.",
    icon: AlertCircle,
    iconClassName: "text-[#B44A5F]",
  },
};

export function BusinessStatusScreen({ status }: BusinessStatusScreenProps) {
  const resolvedStatus: Exclude<BusinessStatus, "active"> =
    status === "suspended" || status === "declined" ? status : "pending";
  const copy = STATUS_COPY[resolvedStatus];
  const Icon = copy.icon;

  return (
    <main className="min-h-screen w-full bg-[#F7F8FB] px-4 py-8 text-[#322D45] sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-[402px]" aria-labelledby="business-status-title">
        <header className="text-center">
          <h1 className="font-heading text-[26px] font-bold tracking-[-0.05em] text-[#322D45]">
            PerklyPh
          </h1>
          <p className="mt-2 inline-flex rounded-full bg-[#FFC9A3] px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-[#322D45]">
            Business Portal
          </p>
        </header>

        <article className="mt-6 rounded-[20px] border border-white/70 bg-[#E4DFF5] p-6 shadow-[0_22px_55px_-32px_rgba(50,45,69,0.5)]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/75">
              <Icon className={`h-5 w-5 ${copy.iconClassName}`} aria-hidden="true" />
            </span>
            <div>
              <h2
                id="business-status-title"
                className="font-heading text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
              >
                {copy.title}
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[#6F697F]">{copy.subtitle}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#817B92]">
              Current status
            </p>
            <p className="mt-1 text-[15px] font-medium capitalize text-[#322D45]">
              {resolvedStatus}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-[#C8C2D7] bg-[#F2F0F9] px-4 py-3 text-[14px] leading-6 text-[#6F697F]">
            <p>
              For concerns, email us at{" "}
              <a
                href="mailto:support@perklyph.com"
                className="font-medium text-[#3E9676] underline underline-offset-2"
              >
                support@perklyph.com
              </a>
              .
            </p>
            <p className="mt-1.5">
              Visit us at{" "}
              <span className="font-medium text-[#322D45]">www.perklyph.com</span>.
            </p>
          </div>

          <LogoutButton />
        </article>
      </section>
    </main>
  );
}
