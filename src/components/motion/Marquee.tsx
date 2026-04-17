"use client";
import { type ReactNode } from "react";

export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-12 md:gap-16 whitespace-nowrap will-change-transform">
        <div className="flex shrink-0 items-center gap-12 md:gap-16">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-12 md:gap-16">{children}</div>
      </div>
    </div>
  );
}
