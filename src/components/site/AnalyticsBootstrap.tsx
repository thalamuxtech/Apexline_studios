"use client";
import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase/client";

export function AnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics().catch(() => {});
  }, []);
  return null;
}
