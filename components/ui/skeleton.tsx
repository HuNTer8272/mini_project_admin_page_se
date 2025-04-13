"use client";

import { cn } from "@/lib/utils"

function Skeleton({ as = "div", className, ...props }: { as?: "div" | "span" } & React.ComponentProps<"div">) {
  const Component = as;
  return (
    <Component
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
