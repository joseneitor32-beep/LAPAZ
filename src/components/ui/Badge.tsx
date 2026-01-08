import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive:
          "border-transparent bg-red-900 text-red-50 hover:bg-red-900/80",
        outline: "text-slate-50",
        admin: "border-transparent bg-red-900/20 text-red-400 border border-red-900/50",
        inspectoria: "border-transparent bg-blue-900/20 text-blue-400 border border-blue-900/50",
        grupo1: "border-transparent bg-indigo-900/30 text-indigo-300 border border-indigo-700/50",
        grupo2: "border-transparent bg-purple-900/30 text-purple-300 border border-purple-700/50",
        singrupo: "border-transparent bg-slate-800 text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
