"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Apex-Line Studios logo. Uses the dark artwork on light backgrounds and
 * the pre-rendered white variant on dark backgrounds so the full wordmark
 * ("Apex-Line Studios" + tagline) is always legible.
 */
export function BrandMark({
  className,
  invert = false,
  size = 40,
}: { className?: string; invert?: boolean; size?: number }) {
  const src = invert ? "/brand/logo-white.png" : "/brand/logo.png";
  return (
    <Image
      src={src}
      alt="Apex-Line Studios"
      width={size * 3}
      height={size}
      priority
      className={cn("select-none", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}
