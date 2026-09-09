import { Coffee, type LucideProps } from "lucide-react";

export type StampCardIconName = "coffee";

type StampCardIconProps = LucideProps & {
  iconName?: StampCardIconName;
};

export const DEFAULT_STAMP_CARD_ICON: StampCardIconName = "coffee";

export function StampCardIcon({
  iconName = DEFAULT_STAMP_CARD_ICON,
  ...props
}: StampCardIconProps) {
  if (iconName === "coffee") {
    return <Coffee {...props} />;
  }

  return <Coffee {...props} />;
}
