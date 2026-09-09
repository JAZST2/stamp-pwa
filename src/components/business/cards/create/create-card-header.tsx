"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateCardHeader() {
  const router = useRouter();

  return (
    <header className="shrink-0 bg-[#F7F8FB]/95 px-5 pb-3 pt-[max(16px,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="grid h-11 grid-cols-[44px_1fr_44px] items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:bg-[#E4DFF5]"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
        <h1 className="text-center font-sora text-[18px] font-semibold tracking-[-0.02em]">
          Create Card
        </h1>
        <span aria-hidden="true" />
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <p className="font-mono text-[11px] leading-none tracking-[0.04em] text-[#777187]">
          1 of 2 - Card Setup
        </p>
        <div
          className="flex items-center gap-1.5 rounded-full border border-[#E4DFF5] bg-white px-2 py-1.5"
          aria-label="Step 1 of 2"
        >
          <span className="h-2 w-5 rounded-full bg-[#9FE0C7]" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-[#B9B4C9]" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
