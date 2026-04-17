# Apex-Line Studios — Website & Admin

Premium architecture/construction website with a functional admin backend for receiving and managing inbound service requests, outreach from trainees, and career applications.

**Tagline:** *...Where Excellence Stands.*
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Firebase (Auth, Firestore, Hosting, Analytics)
**Built by:** [ThalamuxTech](https://thalamux-tech.web.app/)

---

## 1. Local development

```bash
pnpm install      # or npm / yarn
cp .env.local.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

All variables are already present in `.env.local.example` with the provided Firebase config. You'll need:

- `NEXT_PUBLIC_FIREBASE_*` — client config (already provided for project `apexline-studios`).
- `ADMIN_ALLOWLIST_EMAILS` — comma-separated list of admin emails allowed to sign in.
- `FIREBASE_SERVICE_ACCOUNT_BASE64` — base64-encoded service-account JSON (needed for server actions and admin APIs). Generate from Firebase Console → Project settings → Service accounts → *Generate new private key*, then:
  ```bash
  base64 -w0 serviceAccount.json
  ```

---

## 2. Admin account bootstrap

1. In Firebase Console → **Authentication** → **Sign-in method**, enable **Email/Password**.
2. Create an admin user (e.g. `admin@apexlinestudios.com`) under **Users**.
3. Add that email to `ADMIN_ALLOWLIST_EMAILS` in `.env.local` (and in the production env).
4. Visit `/admin/login`, sign in with the created password. A secure HTTP-only session cookie is issued and verified on every admin request.

The admin panel lets you:

- View every inbound submission (Contact, Quote, Careers, Trainee).
- Filter by form type and status.
- Change status (new → contacted → qualified → won/lost/archived).
- Add internal notes.
- Reply via email or call directly from the submission view.
- Delete submissions.

---

## 3. Firebase deployment

### First-time setup

```bash
npm i -g firebase-tools
firebase login
firebase use apexline-studios
```

Enable the required services in the Firebase Console:

- **Hosting** (site: `apexline-studios`)
- **Firestore** (in production mode)
- **Authentication** → Email/Password
- **Storage** (optional, for asset uploads)
- **Analytics** (already configured via `measurementId`)

Deploy rules and site:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
firebase deploy --only hosting
```

Next.js SSR is handled via Firebase's web-frameworks backend automatically on deploy.

---

## 4. Continuous deployment (GitHub → Firebase)

Repository: `https://github.com/thalamuxtech/Apexline_studios.git`

Two workflows are provided in `.github/workflows/`:

- **ci.yml** — typecheck + build on every PR.
- **deploy.yml** — deploys to Firebase Hosting on push to `main`.

### Required repository secrets

| Secret | Purpose |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_APEXLINE` | JSON of a Firebase deploy-permission service account. Paste the full JSON; the action base64-decodes it. |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Same JSON, base64-encoded, used at runtime by Server Actions. |
| `ADMIN_ALLOWLIST_EMAILS` | Comma-separated admin emails. |

The `NEXT_PUBLIC_FIREBASE_*` variables are safe to ship in code — they're already in the repo — or can be set as repository variables if you prefer.

---

## 5. Project structure

```
app/
├── public/
│   ├── brand/      # logo + OG images
│   ├── hero/       # landing hero banner
│   ├── projects/   # per-project image galleries
│   └── site/       # general site photography
├── src/
│   ├── app/
│   │   ├── (site)/              # public routes
│   │   │   ├── page.tsx         # landing
│   │   │   ├── about, services, projects, process
│   │   │   ├── contact, request-a-quote
│   │   │   ├── careers, trainees
│   │   │   ├── journal, privacy, terms
│   │   ├── (admin)/admin/       # admin panel (auth-gated)
│   │   │   ├── login, page.tsx  # dashboard
│   │   │   ├── leads/           # inbox + detail + actions
│   │   │   └── settings/
│   │   ├── actions/             # server actions (leads, auth)
│   │   ├── layout.tsx, globals.css, not-found.tsx
│   ├── components/
│   │   ├── site/    # Nav, Hero, Manifesto, FeaturedProjects,
│   │   │            # ServicesGrid, Process, Stats, Testimonials,
│   │   │            # CtaBand, Footer, PageHeader, ClientMarquee
│   │   ├── forms/   # ContactForm, QuoteForm, CareersForm, TraineeForm, Field
│   │   ├── motion/  # Reveal, ClipReveal, Stagger, Marquee
│   ├── content/     # site.ts (nav, services, projects, testimonials)
│   ├── lib/         # utils, firebase/client, firebase/admin, admin/auth, schemas
│   └── middleware.ts
├── firebase.json, .firebaserc
├── firestore.rules, firestore.indexes.json, storage.rules
└── package.json, tsconfig, tailwind config, next config
```

---

## 6. Forms routed to the admin inbox

| Public route | Form type | Fields |
|---|---|---|
| `/contact` | `contact` | name, email, phone, subject, message, consent |
| `/request-a-quote` | `quote` | full profile + service, type, budget, timeline, location, description |
| `/careers` | `careers` | name, email, phone, role, experience, location, portfolio, cover letter |
| `/trainees` | `trainee` | name, email, phone, school, course, level, duration, interest, motivation |

All submissions are validated server-side with Zod, written to Firestore via a Server Action, and appear in `/admin/leads` in real time.

---

## 7. Accessibility and responsiveness

- Mobile-first layouts; every page tested from 320px to 2560px.
- Semantic HTML, labelled form controls, visible focus rings.
- `prefers-reduced-motion` respected — parallax and heavy reveals are disabled automatically.
- Images served via `next/image` with AVIF/WebP and responsive srcset.

---

## 8. Support

For questions or access requests, email the principal at the address listed on the public contact page.

---

Built and maintained by **[ThalamuxTech](https://thalamux-tech.web.app/)**.
