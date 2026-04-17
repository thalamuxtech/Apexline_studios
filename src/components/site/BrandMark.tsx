"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ArchiLogo linemark. When `invert` is true (on dark backgrounds), we
 * flip the black artwork to near-white via a CSS filter so the linework
 * stays visible without needing a second asset.
 */
export function BrandMark({
  className,
  invert = false,
  size = 40,
}: { className?: string; invert?: boolean; size?: number }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Apex-Line Studios"
      width={size * 3}
      height={size}
      priority
      className={cn(
        "h-auto w-auto select-none",
        invert && "brightness-0 invert",
        className,
      )}
      style={{ height: size, width: "auto" }}
    />
  );
}
