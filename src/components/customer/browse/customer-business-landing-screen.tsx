import { ArrowLeft, Mail, MapPin, Phone, Store } from "lucide-react";
import Link from "next/link";
import type { BrowseBusinessLanding } from "@/lib/customer/browse";
import { CustomerLandingCardItem } from "./customer-landing-card-item";

type CustomerBusinessLandingScreenProps = {
  business: BrowseBusinessLanding;
};

export function CustomerBusinessLandingScreen({ business }: CustomerBusinessLandingScreenProps) {
  return (
    <>
      <header className="border-b border-[#E4DFF5]/80 bg-[#F7F8FB]/95 px-5 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mx-auto grid h-14 w-full max-w-[402px] grid-cols-[44px_1fr_44px] items-center">
          <Link
            href="/browse"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#322D45] transition hover:bg-[#E4DFF5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
            aria-label={`Back to browse shops`}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <h1 className="truncate text-center font-display text-[17px] font-semibold tracking-[-0.02em]">
            Join Card
          </h1>
          <span aria-hidden="true" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-[calc(108px+env(safe-area-inset-bottom))] pt-5">
        <section className="overflow-hidden rounded-[20px] border border-white/70 bg-[#E4DFF5] shadow-[0_10px_26px_rgba(50,45,69,0.08)]">
          <div
            className="h-28 w-full bg-[#DCD5F2]"
            style={
              business.coverPhotoUrl
                ? {
                    backgroundImage: `url(${business.coverPhotoUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-hidden="true"
          />
          <div className="px-4 pb-4">
            <div className="-mt-6 flex items-end gap-3">
              {business.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logoUrl}
                  alt=""
                  className="h-14 w-14 rounded-full border-[3px] border-white bg-white object-cover shadow-sm"
                />
              ) : (
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white bg-[#ECE7FA] text-[#625C74] shadow-sm"
                  aria-hidden="true"
                >
                  <Store className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 pb-1">
                <h2 className="truncate font-display text-[18px] font-semibold tracking-[-0.025em] text-[#322D45]">
                  {business.name}
                </h2>
                <p className="mt-0.5 text-[13px] text-[#746E84]">{business.tagline}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-[12px] leading-4 text-[#625C74]">
              {business.address ? (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7E7890]" aria-hidden="true" />
                  <div>
                    <dt className="sr-only">Address</dt>
                    <dd>{business.address}</dd>
                  </div>
                </div>
              ) : null}
              {business.contactEmail ? (
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#7E7890]" aria-hidden="true" />
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>{business.contactEmail}</dd>
                  </div>
                </div>
              ) : null}
              {business.contactPhone ? (
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#7E7890]" aria-hidden="true" />
                  <div>
                    <dt className="sr-only">Phone</dt>
                    <dd>{business.contactPhone}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="active-cards-heading">
          <h2 id="active-cards-heading" className="font-display text-[16px] font-semibold tracking-[-0.02em]">
            Join loyalty card
          </h2>
          <p className="mt-1 text-[12px] text-[#746E84]">
            Tap Join to add this card to your wallet.
          </p>
          {business.cards.length > 0 ? (
            <div className="mt-4 space-y-4">
              {business.cards.map((card) => (
                <CustomerLandingCardItem key={card.id} businessName={business.name} card={card} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-[20px] border border-[#D4CEE8] bg-[#EDE8F8]/55 px-4 py-6 text-center text-[13px] text-[#777186]">
              This shop has no active stamp cards yet.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
