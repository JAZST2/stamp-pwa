"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  StampCardCreateInput,
  StampCardMilestoneCreateInput,
  StampCardSetupDraft,
} from "@/lib/business/stamp-cards";
import { ScreenOverlayLoader } from "@/components/ui";
import { createStampCardDraftAction } from "@/app/(business)/cards/create/actions";
import { CreateCardHeader } from "./create-card-header";
import { MilestoneEditorItem } from "./milestone-editor-item";
import { StampTotalStepper } from "./stamp-total-stepper";

type MilestoneDraft = StampCardMilestoneCreateInput & { id: string };

const INITIAL_TOTAL_STAMPS = 8;
const INITIAL_MILESTONES: MilestoneDraft[] = [
  {
    id: "milestone-five",
    stamp_number: 5,
    reward_description: "Free Upsize",
  },
  {
    id: "milestone-eight",
    stamp_number: 8,
    reward_description: "Free Signature Drink",
  },
];
const REQUEST_TIMEOUT_MS = 20000;

function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFutureDate(dateValue: string | null): boolean {
  if (!dateValue) {
    return false;
  }

  const selected = new Date(dateValue);
  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  selected.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() > today.getTime();
}

function createInitialCardDraft(): StampCardCreateInput {
  return {
    name: "",
    total_stamps: INITIAL_TOTAL_STAMPS,
    expiry_date: null,
    rules: null,
    status: "inactive",
  };
}

function clampMilestoneStampNumber(stampNumber: number, totalStamps: number): number {
  return Math.min(totalStamps, Math.max(1, stampNumber));
}

export function CreateStampCardScreen() {
  const router = useRouter();
  const [cardDraft, setCardDraft] = useState<StampCardCreateInput>(
    createInitialCardDraft(),
  );
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(INITIAL_MILESTONES);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTotalStampsChange(nextTotalStamps: number) {
    setCardDraft((current) => ({
      ...current,
      total_stamps: nextTotalStamps,
    }));

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
                cardDraft.total_stamps,
              ),
            }
          : milestone,
      ),
    );
  }

  function handleMilestoneRewardChange(id: string, nextRewardDescription: string) {
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
        stamp_number: Math.min(cardDraft.total_stamps, current.length + 2),
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

  function hasMilestones(): boolean {
    return (
      milestones.length > 0 &&
      milestones.every(
        (milestone) => milestone.reward_description.trim().length > 0,
      )
    );
  }

  function hasExpiryDate(): boolean {
    return isFutureDate(cardDraft.expiry_date);
  }

  function hasCardRules(): boolean {
    return Boolean(cardDraft.rules && cardDraft.rules.trim().length > 0);
  }

  function canProceedToStepTwo(): boolean {
    return hasMilestones() && hasExpiryDate() && hasCardRules();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasMilestones()) {
      setStatusMessage(
        "Add at least one milestone and complete the reward before continuing.",
      );
      return;
    }

    if (!hasExpiryDate()) {
      setStatusMessage("Expiry date must be after today.");
      return;
    }

    if (!hasCardRules()) {
      setStatusMessage("Card rules are required before continuing.");
      return;
    }

    const payload: StampCardSetupDraft = {
      card: {
        ...cardDraft,
        status: "inactive",
      },
      milestones: milestones.map((milestone) => ({
        stamp_number: milestone.stamp_number,
        reward_description: milestone.reward_description.trim(),
      })),
    };

    setStatusMessage("Saving card setup...");
    setIsSubmitting(true);

    void (async () => {
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      try {
        const result = await Promise.race([
          createStampCardDraftAction(payload),
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

        setStatusMessage("Card setup saved. Ready for the QR step.");
        router.push(`/cards/create/qr/${result.cardId}`);
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

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[402px] flex-col overflow-hidden bg-[#F7F8FB] text-[#322D45]">
      <ScreenOverlayLoader
        visible={isSubmitting}
        title="Saving card setup"
        description="Creating card and milestones..."
      />
      <CreateCardHeader />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2">
        <form
          id="card-setup-form"
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-white/70 bg-[#EEEBF8] p-5 shadow-[0_10px_30px_rgba(50,45,69,0.07)]"
        >
          <section aria-labelledby="card-info-title">
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="card-info-title"
                className="font-sora text-[17px] font-semibold tracking-[-0.02em]"
              >
                Card Info
              </h2>
              <span className="rounded-full bg-white/75 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#746E82]">
                Required
              </span>
            </div>

            <div>
              <label htmlFor="card-name" className="mb-2 block text-[13px] font-medium text-[#514B60]">
                Card Name
              </label>
              <input
                id="card-name"
                name="cardName"
                type="text"
                required
                value={cardDraft.name}
                onChange={(event) =>
                  setCardDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Kape Juan Loyalty Card"
                className="h-[52px] w-full rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 text-[14px] text-[#322D45] placeholder:text-[#777187] transition focus:border-[#9FE0C7] focus:outline-none focus:ring-4 focus:ring-[#9FE0C7]/35"
              />
            </div>

            <StampTotalStepper
              value={cardDraft.total_stamps}
              onChange={handleTotalStampsChange}
            />

            <div className="mt-5">
              <label
                htmlFor="expiry-date"
                className="mb-2 block text-[13px] font-medium text-[#514B60]"
              >
                Expiry Date
              </label>
              <div className="flex h-[52px] items-center gap-3 rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 transition focus-within:border-[#9FE0C7] focus-within:ring-4 focus-within:ring-[#9FE0C7]/35">
                <CalendarDays
                  className="h-5 w-5 shrink-0 text-[#6E687C]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <input
                  id="expiry-date"
                  name="expiryDate"
                  type="date"
                  required
                  min={getTomorrowDateString()}
                  value={cardDraft.expiry_date ?? ""}
                  onChange={(event) =>
                    setCardDraft((current) => ({
                      ...current,
                      expiry_date: event.target.value || null,
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#514B60] outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="card-rules"
                className="mb-2 block text-[13px] font-medium text-[#514B60]"
              >
                Card Rules
              </label>
              <textarea
                id="card-rules"
                name="cardRules"
                rows={4}
                required
                value={cardDraft.rules ?? ""}
                onChange={(event) =>
                  setCardDraft((current) => ({
                    ...current,
                    rules: event.target.value || null,
                  }))
                }
                placeholder="Describe how customers earn stamps (e.g. 1 stamp per purchase over PHP 100)."
                className="w-full resize-none rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 py-3.5 text-[14px] leading-5 text-[#322D45] placeholder:text-[#777187] transition focus:border-[#9FE0C7] focus:outline-none focus:ring-4 focus:ring-[#9FE0C7]/35"
              />
            </div>
          </section>

          <section className="mt-7 border-t border-[#D5D0E5] pt-6" aria-labelledby="milestones-title">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC9A3]"
                aria-hidden="true"
              >
                <Star className="h-4 w-4 fill-[#FFC9A3] text-[#322D45]" strokeWidth={2} />
              </span>
              <h2
                id="milestones-title"
                className="font-sora text-[17px] font-semibold tracking-[-0.02em]"
              >
                Milestones
              </h2>
            </div>
            <p className="mb-4 text-[12px] leading-5 text-[#777187]">
              Reward customers along the way to their final perk.
            </p>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <MilestoneEditorItem
                  key={milestone.id}
                  milestone={milestone}
                  maxStampNumber={cardDraft.total_stamps}
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
              className="mt-4 inline-flex items-center gap-2 rounded-full px-1 py-2 text-[13px] font-medium text-[#347A63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9FE0C7] text-[#322D45]"
                aria-hidden="true"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span>Add Milestone</span>
            </button>
          </section>

          <p className="sr-only" role="status" aria-live="polite">
            {statusMessage}
          </p>
        </form>
      </main>

      <footer className="shrink-0 border-t border-[#E4DFF5] bg-[#F7F8FB]/96 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(50,45,69,0.08)] backdrop-blur-md">
        <button
          type="submit"
          form="card-setup-form"
          disabled={!canProceedToStepTwo() || isSubmitting}
          className="flex h-14 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-6 font-sora text-[15px] font-semibold text-[#322D45] shadow-[0_8px_20px_rgba(79,153,124,0.22)] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
        >
          {isSubmitting ? "Saving..." : "Continue to QR Step ->"}
        </button>
      </footer>
    </div>
  );
}
