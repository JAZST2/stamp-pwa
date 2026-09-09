"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Pause,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  StampCardDetailItem,
  StampCardMilestoneCreateInput,
  StampCardStatus,
} from "@/lib/business/stamp-cards";
import { ConfirmPopup, ScreenOverlayLoader } from "@/components/ui";
import {
  softDeleteStampCardAction,
  updateStampCardAction,
} from "@/app/(business)/cards/[cardId]/edit/actions";
import { MilestoneEditorItem } from "../create/milestone-editor-item";
import { StampTotalStepper } from "../create/stamp-total-stepper";

type MilestoneDraft = StampCardMilestoneCreateInput & { id: string };

type EditStampCardScreenProps = {
  card: StampCardDetailItem;
};

const REQUEST_TIMEOUT_MS = 20000;

function toDateInputValue(value: string | null): string {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatUpdatedDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently updated";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function clampMilestoneStampNumber(
  stampNumber: number,
  totalStamps: number,
): number {
  return Math.min(totalStamps, Math.max(1, stampNumber));
}

function buildInitialMilestones(
  milestones: StampCardMilestoneCreateInput[],
): MilestoneDraft[] {
  if (milestones.length === 0) {
    return [
      {
        id: "milestone-1",
        stamp_number: 1,
        reward_description: "",
      },
    ];
  }

  return milestones.map((milestone, index) => ({
    ...milestone,
    id: `milestone-${index + 1}-${milestone.stamp_number}`,
  }));
}

function getNextMilestoneNumber(
  milestones: MilestoneDraft[],
  totalStamps: number,
): number {
  const highest = milestones.reduce(
    (currentMax, milestone) => Math.max(currentMax, milestone.stamp_number),
    1,
  );

  return Math.min(totalStamps, highest + 1);
}

export function EditStampCardScreen({ card }: EditStampCardScreenProps) {
  const router = useRouter();
  const [name, setName] = useState(card.name);
  const [totalStamps, setTotalStamps] = useState(card.total_stamps);
  const [expiryDate, setExpiryDate] = useState(
    toDateInputValue(card.expiry_date),
  );
  const [rules, setRules] = useState(card.rules ?? "");
  const [status, setStatus] = useState<StampCardStatus>(card.status);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(
    buildInitialMilestones(card.milestones),
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function onBack() {
    router.push(`/cards/${card.id}`);
  }

  function handleTotalStampsChange(nextTotalStamps: number) {
    setTotalStamps(nextTotalStamps);
    setMilestones((current) =>
      current.map((milestone) => ({
        ...milestone,
        stamp_number: clampMilestoneStampNumber(
          milestone.stamp_number,
          nextTotalStamps,
        ),
      })),
    );
  }

  function handleMilestoneStampChange(id: string, nextStampNumber: number) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === id
          ? {
              ...milestone,
              stamp_number: clampMilestoneStampNumber(
                nextStampNumber,
                totalStamps,
              ),
            }
          : milestone,
      ),
    );
  }

  function handleMilestoneRewardChange(
    id: string,
    nextRewardDescription: string,
  ) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === id
          ? {
              ...milestone,
              reward_description: nextRewardDescription,
            }
          : milestone,
      ),
    );
  }

  function addMilestone() {
    setMilestones((current) => [
      ...current,
      {
        id: `milestone-${Date.now()}`,
        stamp_number: getNextMilestoneNumber(current, totalStamps),
        reward_description: "",
      },
    ]);
  }

  function removeMilestone(id: string) {
    setMilestones((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current.filter((milestone) => milestone.id !== id);
    });
  }

  function toggleStatus() {
    setStatus((current) => (current === "inactive" ? "active" : "inactive"));
  }

  async function confirmDeleteCard() {
    if (isDeleting || isSubmitting) {
      return;
    }

    setIsDeleting(true);
    setStatusMessage("Deleting card...");

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      const result = await Promise.race([
        softDeleteStampCardAction(card.id),
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => {
            reject(new Error("request_timeout"));
          }, REQUEST_TIMEOUT_MS);
        }),
      ]);

      if (!result.ok) {
        setStatusMessage(result.error);
        return;
      }

      setIsDeleteConfirmOpen(false);
      setStatusMessage("Card deleted.");
      router.push("/cards");
    } catch (error) {
      if (error instanceof Error && error.message === "request_timeout") {
        setStatusMessage("Request timed out. Please try again.");
        return;
      }
      setStatusMessage("Unexpected error. Please try again.");
    } finally {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      setIsDeleting(false);
    }
  }

  function hasValidForm(): boolean {
    return (
      name.trim().length > 0 &&
      expiryDate.length > 0 &&
      rules.trim().length > 0 &&
      milestones.length > 0 &&
      milestones.every(
        (milestone) => milestone.reward_description.trim().length > 0,
      )
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasValidForm()) {
      setStatusMessage("Complete all required fields before saving.");
      return;
    }

    setStatusMessage("Saving changes...");
    setIsSubmitting(true);

    const payload = {
      cardId: card.id,
      name: name.trim(),
      total_stamps: totalStamps,
      expiry_date: expiryDate,
      rules: rules.trim(),
      status,
      milestones: milestones.map((milestone) => ({
        stamp_number: milestone.stamp_number,
        reward_description: milestone.reward_description.trim(),
      })),
    } as const;

    void (async () => {
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      try {
        const result = await Promise.race([
          updateStampCardAction(payload),
          new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => {
              reject(new Error("request_timeout"));
            }, REQUEST_TIMEOUT_MS);
          }),
        ]);

        if (!result.ok) {
          setStatusMessage(result.error);
          return;
        }

        setStatusMessage("Card updated.");
        router.push(`/cards/${card.id}`);
      } catch (error) {
        if (error instanceof Error && error.message === "request_timeout") {
          setStatusMessage("Request timed out. Please try again.");
          return;
        }
        setStatusMessage("Unexpected error. Please try again.");
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        setIsSubmitting(false);
      }
    })();
  }

  const isInactive = status === "inactive";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-[#F7F8FB] text-[#322D45]">
      <ScreenOverlayLoader
        visible={isSubmitting || isDeleting}
        title={isDeleting ? "Deleting card" : "Updating card"}
        description={
          isDeleting
            ? "Deleting this card from your list..."
            : "Saving card details and milestones..."
        }
      />

      <header className="sticky top-0 z-30 border-b border-[#E8E6EF] bg-[#F7F8FB]/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
            aria-label="Back to card details"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="font-sora text-[17px] font-semibold tracking-[-0.02em]">
            Edit Card
          </h1>
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(true)}
            disabled={isSubmitting || isDeleting}
            className="justify-self-end rounded-full px-1 py-2 text-right text-[12px] font-normal text-[#C97873] transition-colors hover:text-[#A44D49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97873] disabled:opacity-60"
          >
            Delete Card
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
        <section
          className="mb-4 flex items-center gap-3 px-1"
          aria-label="Card status"
        >
          <span
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
              isInactive
                ? "bg-[#E7E4ED] text-[#6F697E]"
                : "bg-[#9FE0C7] text-[#322D45]"
            }`}
          >
            {isInactive ? "Inactive" : "Active"}
          </span>
          <p className="text-[12px] font-normal text-[#817B90]">
            Last updated {formatUpdatedDate(card.updated_at)}
          </p>
        </section>

        <form
          id="edit-card-form"
          onSubmit={handleSubmit}
          className="rounded-[20px] bg-[#E4DFF5] p-4 shadow-[0_12px_34px_rgba(50,45,69,0.09)] sm:p-5"
        >
          <section aria-labelledby="card-info-heading">
            <div className="mb-5 flex items-center justify-between border-b border-[#CBC5DF] pb-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#716A82]">
                  Existing card
                </p>
                <h2
                  id="card-info-heading"
                  className="mt-1 font-sora text-[20px] font-bold tracking-[-0.03em]"
                >
                  Card Info
                </h2>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/75">
                <Check className="h-4 w-4 text-[#4F8D75]" strokeWidth={2.5} />
              </span>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">
                  Card Name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-12 w-full rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 text-[15px] font-medium text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30"
                />
              </label>

              <div>
                <span
                  id="stamp-count-label"
                  className="mb-2 block text-[13px] font-medium text-[#5D576C]"
                >
                  Total Stamps Required
                </span>
                <StampTotalStepper
                  value={totalStamps}
                  onChange={handleTotalStampsChange}
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">
                  Expiry Date
                </span>
                <span className="relative block">
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    required
                    className="h-12 w-full rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 pr-12 text-[15px] text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30"
                  />
                  <CalendarDays
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777084]"
                    aria-hidden="true"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">
                  Card Rules
                </span>
                <textarea
                  value={rules}
                  onChange={(event) => setRules(event.target.value)}
                  rows={4}
                  required
                  className="w-full resize-none rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 py-3 text-[14px] leading-6 text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30"
                />
              </label>
            </div>
          </section>

          <section
            className="mt-8 border-t border-[#CBC5DF] pt-6"
            aria-labelledby="milestones-heading"
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#716A82]">
                  Reward path
                </p>
                <h2
                  id="milestones-heading"
                  className="mt-1 font-sora text-[20px] font-bold tracking-[-0.03em]"
                >
                  Milestones &amp; Rewards
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <MilestoneEditorItem
                  key={milestone.id}
                  milestone={milestone}
                  maxStampNumber={totalStamps}
                  onStampChange={handleMilestoneStampChange}
                  onRewardChange={handleMilestoneRewardChange}
                  onRemove={removeMilestone}
                  canRemove={milestones.length > 1}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addMilestone}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-2 py-2 text-[13px] font-medium text-[#30775D] transition-colors hover:bg-[#9FE0C7]/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D9A7D]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              <span>Add Milestone</span>
            </button>
          </section>

          <section
            className="mt-7 border-t border-[#CBC5DF] pt-6"
            aria-labelledby="danger-heading"
          >
            <h2
              id="danger-heading"
              className="mb-3 font-sora text-[16px] font-semibold tracking-[-0.02em] text-[#5B5369]"
            >
              Danger Zone
            </h2>
            <div className="rounded-[18px] border border-[#F1C8C5] bg-[#FFF2F1] p-4">
              <p className="mb-3 text-[13px] font-normal leading-5 text-[#777080]">
                Deactivating will hide this card from new customers.
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D99591] px-4 text-[13px] font-medium text-[#9C504D] transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86863]"
              >
                {isInactive ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {isInactive ? "Reactivate Card" : "Deactivate Card"}
                </span>
              </button>
            </div>
          </section>

          <p className="sr-only" role="status" aria-live="polite">
            {statusMessage}
          </p>
        </form>

        <div className="min-h-7 px-2 pt-3" role="status" aria-live="polite">
          {statusMessage ? (
            <p className="text-center text-[12px] font-medium text-[#5C756B]">
              {statusMessage}
            </p>
          ) : null}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E6E3EB] bg-[#F7F8FB]/96 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_28px_rgba(50,45,69,0.08)] backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-[402px] grid-cols-[0.82fr_1.18fr] gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-12 rounded-full border border-[#B9B4C9] bg-transparent text-[14px] font-medium text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-card-form"
            disabled={!hasValidForm() || isSubmitting || isDeleting}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] text-[14px] font-semibold text-[#322D45] shadow-[0_6px_16px_rgba(87,151,126,0.2)] transition-colors hover:bg-[#8DD6BA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </footer>

      <ConfirmPopup
        open={isDeleteConfirmOpen}
        title="Delete this card?"
        subtitle="Are you sure? This cannot be undone."
        confirmLabel="Delete Card"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteConfirmOpen(false);
          }
        }}
        onConfirm={() => {
          void confirmDeleteCard();
        }}
      />
    </div>
  );
}
