# Apex-Line Studios

> _...Where Excellence Stands._

Marketing website and content-managed admin panel for Apex-Line Studios — a Lagos-based architecture, construction and interior design firm.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_·_Firestore_·_Storage-FFCA28?logo=firebase&logoColor=black)

`architecture` · `portfolio` · `cms` · `admin-panel` · `nextjs` · `firebase` · `static-export`

---

## Overview

A static-exported Next.js site with a live, Firebase-backed CMS. Admins manage every image, title and word on the public site — hero slider, project galleries, services, testimonials, stats, client marquee and studio profile — without a redeploy. All content falls back to the values in `src/content/site.ts` when nothing is saved.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_FIREBASE_*
npm run dev                         # http://localhost:3000
```

| Command | Description |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js lint |

## Admin panel

1. Enable **Email/Password** auth in the Firebase Console and create the admin user.
2. Grant that account the `admin: true` custom claim (via the Admin SDK / a Cloud Function).
3. Sign in at `/admin/login`.

Managers: **Dashboard** (leads + analytics), **Inbox** (Contact / Quote / Careers / Trainee submissions), and **Content** — Projects & Hero, Services, Testimonials, Stats & Clients, Studio Profile.

Managed content is stored under the Firestore `settings/*` documents and the `projects` collection; access is enforced by `firestore.rules` (public read, admin-only write).

## Deploy

```bash
firebase deploy --only hosting,firestore:rules
```

The static `out/` build is served by Firebase Hosting. CI/CD lives in `.github/workflows/` (typecheck + build on PRs, deploy on push to `main`).

## Structure

```
src/
├── app/
│   ├── (site)/         # public routes
│   └── (admin)/admin/  # auth-gated admin + /content managers
├── components/
│   ├── site/           # public UI
│   ├── admin/          # admin UI kit (icons, toasts, primitives)
│   ├── forms/ · motion/
├── content/site.ts     # content fallbacks
└── lib/                # firebase client, projects, useSiteContent hooks
```

---

Built and maintained by **[ThalamuxTech](https://thalamux-tech.web.app/)**.
