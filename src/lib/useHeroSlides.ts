"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

export type HeroSlide = {
  src: string;
  label: string;
  sector: string;
  year: string;
};

export const fallbackHeroSlides: HeroSlide[] = [
  { src: "/hero/hero-primary.jpg", label: "Marion Apartment", sector: "Luxury Residential", year: "2025" },
  { src: "/hero/hero-alt.jpg", label: "ED Marina", sector: "Heritage Commercial", year: "2020" },
  { src: "/hero/hero-craft.jpg", label: "Shell FMH, Marina", sector: "Corporate Facilities", year: "2024" },
];

export function cleanHeroSlides(slides: HeroSlide[]) {
  return slides
    .map((slide) => ({
      src: slide.src.trim(),
      label: slide.label.trim(),
      sector: slide.sector.trim(),
      year: String(slide.year).trim(),
    }))
    .filter((slide) => slide.src && slide.label);
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackHeroSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    async function load() {
      try {
        const snap = await getDoc(doc(getDb(), "settings", "heroSlides"));
        const managed = cleanHeroSlides((snap.data()?.slides ?? []) as HeroSlide[]);
        if (live && managed.length) setSlides(managed);
      } catch (e) {
        console.error(e);
      } finally {
        if (live) setLoading(false);
      }
    }
    load();
    return () => {
      live = false;
    };
  }, []);

  return { slides, loading };
}
