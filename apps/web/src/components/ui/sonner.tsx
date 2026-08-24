import type { ToasterProps } from "sonner";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      // toastOptions={{
      //   classNames: {
      //     toast: "cn-toast",
      //     success:
      //       "!bg-primary !text-sm !text-white !font-medium  !border-accent  ",
      //   },
      // }}
      toastOptions={{
        classNames: {
          // Shrinks overall height, removes heavy default padding, sets auto-width
          toast:
            "!py-3 !px-3.5 !min-h-0 !w-auto !max-w-xs !gap-2 !rounded-lg !shadow-md",
          title: "!text-xs !font-medium !m-0 !p-0",
          success: "!bg-primary !text-white !border-accent",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
