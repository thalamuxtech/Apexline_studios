import { projects, type ProjectRecord } from "@/content/site";

export type ManagedProject = ProjectRecord & {
  status?: "draft" | "published";
  updatedAt?: unknown;
};

export type ProjectFormData = Omit<ManagedProject, "year"> & {
  year: number | string;
};

export const projectFallbacks: ManagedProject[] = projects.map((project) => ({
  ...project,
  status: "published",
}));

export function normalizeProject(project: ProjectFormData): ManagedProject {
  const year = typeof project.year === "string" ? Number(project.year) : project.year;
  return {
    ...project,
    year: Number.isFinite(year) ? year : new Date().getFullYear(),
    gallery: Array.from(new Set((project.gallery ?? []).filter(Boolean))),
    cover: project.cover || project.gallery?.[0] || "",
    status: project.status ?? "published",
  };
}

export function mergeManagedProjects(managed: ManagedProject[]) {
  const bySlug = new Map(projectFallbacks.map((project) => [project.slug, project]));

  for (const project of managed) {
    bySlug.set(project.slug, normalizeProject({ ...project, year: project.year }));
  }

  return Array.from(bySlug.values()).filter((project) => project.status !== "draft");
}

