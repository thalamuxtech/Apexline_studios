"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { mergeManagedProjects, projectFallbacks, type ManagedProject } from "@/lib/projects";

type ManagedProjectState = {
  projects: ManagedProject[];
  loading: boolean;
  error: string | null;
};

export function useManagedProjects(includeDrafts = false): ManagedProjectState {
  const [managed, setManaged] = useState<ManagedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const base = collection(getDb(), "projects");
        const q = includeDrafts ? query(base) : query(base, where("status", "==", "published"));
        const snap = await getDocs(q);
        if (!live) return;
        setManaged(snap.docs.map((doc) => ({ ...(doc.data() as ManagedProject), slug: doc.id })));
      } catch (e) {
        console.error(e);
        if (!live) return;
        setError("Managed portfolio content could not be loaded.");
        setManaged([]);
      } finally {
        if (live) setLoading(false);
      }
    }

    load();
    return () => {
      live = false;
    };
  }, [includeDrafts]);

  const projects = useMemo(
    () => mergeManagedProjects(managed).sort((a, b) => b.year - a.year),
    [managed, includeDrafts],
  );

  return {
    projects: includeDrafts ? mergeAdminProjects(managed) : projects,
    loading,
    error,
  };
}

function mergeAdminProjects(managed: ManagedProject[]) {
  const bySlug = new Map(projectFallbacks.map((project) => [project.slug, project]));
  for (const project of managed) bySlug.set(project.slug, { ...bySlug.get(project.slug), ...project });
  return Array.from(bySlug.values()).sort((a, b) => b.year - a.year);
}




