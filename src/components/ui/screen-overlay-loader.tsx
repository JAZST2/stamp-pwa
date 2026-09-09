import { cn } from "@/lib/utils";

type ScreenOverlayLoaderProps = {
  visible: boolean;
  title?: string;
  description?: string;
  className?: string;
};

export function ScreenOverlayLoader({
  visible,
  title = "Processing request",
  description = "Please wait a moment.",
  className,
}: ScreenOverlayLoaderProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#322D45]/28 px-6 backdrop-blur-[2px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="w-full max-w-[268px] rounded-[20px] border border-[#E4DFF5] bg-[#F7F8FB] p-5 text-center shadow-[0_20px_50px_rgba(50,45,69,0.2)]">
        <div className="mx-auto h-10 w-10 rounded-full border-[3px] border-[#D8D3E7] border-t-[#9FE0C7] animate-spin" />
        <p className="mt-3 font-sora text-[14px] font-semibold text-[#322D45]">{title}</p>
        <p className="mt-1 text-[12px] leading-5 text-[#746E82]">{description}</p>
      </div>
    </div>
  );
}
