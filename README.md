# Toochukwu — Data Analyst Portfolio

> *"I turn messy data into clear business decisions."*

A fast, accessible, dark-first portfolio built with **React 18 + Vite + TypeScript**, **Tailwind CSS v4**, **React Three Fiber**, **Motion**, **Recharts** and **React Router**. No backend is needed: all content lives in typed files, and an optional API can take over later.

| | |
|---|---|
| **Landing page** | 3D hero, animated KPI counters, about, skills + tool orbit, filterable projects, services, experience timeline, testimonials carousel, contact form |
| **Case studies** | `/projects/:slug`: problem, dataset, approach, interactive Recharts chart (with a table view), insights, impact |
| **Performance** | Route-level code splitting; Three.js and Recharts only download where they're used; 3D waits for browser idle, renders only while visible, and falls back to a static SVG |
| **Accessibility** | Semantic landmarks, skip link, visible focus, keyboard-operable carousel/filters/menu, reduced-motion support, validated chart colours, AA contrast tokens |
| **SEO** | Meta + Open Graph + Twitter tags, `Person` JSON-LD, per-case-study `CreativeWork` JSON-LD, generated `sitemap.xml` + `robots.txt`, favicon set, web manifest |

---

## 1. Quick start

Requires **Node 20.19+** (or 22+).

```bash
npm install
cp .env.example .env.local   # optional; the site runs without it
npm run dev                  # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run assets` | Regenerate favicon, OG image, manifest, and portrait/CV placeholders |
| `npm run images` | Convert your own photos/screenshots into AVIF + WebP + JPG |

---

## 2. Project structure

```
├─ index.html               SEO placeholders ({{TITLE}} …) filled at build from src/content/profile.ts
├─ vite.config.ts           Plugins, chunking, and the SEO plugin (JSON-LD, sitemap.xml, robots.txt)
├─ vercel.json              SPA rewrites + cache/security headers
├─ scripts/
│  ├─ generate-assets.mjs   Favicons, og-image.png, manifest, placeholders
│  └─ optimize-images.mjs   public/images/raw/* → AVIF/WebP/JPG
├─ public/                  Static files (favicon, og-image, images/, cv/)
└─ src/
   ├─ index.css             The only stylesheet: Tailwind entry + light/dark theme tokens
   ├─ content/              ✏️ ALL EDITABLE CONTENT LIVES HERE
   ├─ types/content.ts      The content model (TypeScript types)
   ├─ services/
   │  ├─ api.ts             fetch + timeout + local fallback
   │  ├─ content.ts         getProjects(), getProject(slug), getSkills() … ← components use these
   │  └─ contact.ts         Web3Forms / Formspree / EmailJS delivery
   ├─ hooks/                useResource (loading/fallback state), useTheme, useDeviceCapability …
   ├─ components/
   │  ├─ ui/                Button, Magnetic, Reveal, Counter, Toast, Seo, Skeleton, ToolOrbit …
   │  ├─ layout/            Navbar, Footer, Layout, Logo
   │  ├─ three/             HeroScene (WebGL), HeroVisual (loading/fallback gate), StaticHeroVisual
   │  └─ projects/          ProjectCard, ProjectThumbnail (generated), ResultsChart (Recharts)
   ├─ sections/             One file per landing-page section
   └─ pages/                HomePage, ProjectPage, NotFoundPage (each its own chunk)
```

---

## 3. Editing content (no component changes needed)

Every placeholder is marked with **✏️** in `src/content/`. Search the folder for `✏️` to find them all.

| File | Controls |
|---|---|
| `profile.ts` | Name, headline (wrap highlighted words in `*asterisks*`), value proposition, bio, location, email, WhatsApp number, social links, CV path, photo, SEO description, nav links |
| `stats.ts` | The four animated impact counters |
| `skills.ts` | Skill groups with 0–100 proficiency, plus the tools on the orbit |
| `projects.ts` | Project cards **and** their case-study pages (see below) |
| `services.ts` | Service cards (title, description, deliverables, pricing) |
| `experience.ts` | Timeline entries: `kind` is `role`, `certification` or `education` |
| `testimonials.ts` | Carousel quotes (use real, permission-granted quotes) |

TypeScript checks every edit: a missing field or a typo'd category fails `npm run build` with a clear message.

### Adding a project

Copy an existing object in `projects.ts` and change it. Key fields:

- `slug`: URL of the case study (`/projects/<slug>`); keep it unique, lowercase and hyphenated.
- `category`: one of `Dashboards`, `Machine Learning`, `SQL Analysis`, `Data Cleaning` (drives the filter).
- `keyMetric`: the headline number on the card, e.g. `{ value: '−17%', label: 'monthly churn' }`.
- `links.github` / `links.live`: optional; buttons only appear when set.
- `caseStudy.chart`: the interactive chart:
  ```ts
  chart: {
    type: 'line',                    // 'bar' | 'line' | 'area'
    title: 'Monthly churn rate (%)',
    xKey: 'month',                   // field used for the x-axis
    valueFormat: 'percent',          // 'number' | 'compact' | 'percent' | 'currency'
    series: [
      { key: 'churn', label: 'Actual', tone: 'primary' },      // accent colour, solid
      { key: 'baseline', label: 'Forecast', tone: 'secondary' } // comparison colour, dashed
    ],
    data: [{ month: 'M1', churn: 6.1, baseline: 6.1 }, /* … */],
  }
  ```
- `thumbnail`: optional screenshot. Without it a unique dashboard-style thumbnail is drawn from the chart data.

The sitemap updates automatically on the next build.

### Images (AVIF/WebP)

1. Put originals in `public/images/raw/` (e.g. `portrait.jpg`, `churn-dashboard.png`).
2. Run `npm run images` → writes `public/images/<name>.avif|webp|jpg` (max 1600px wide).
3. Reference them in content:
   ```ts
   thumbnail: { avif: '/images/churn-dashboard.avif', webp: '/images/churn-dashboard.webp',
                src: '/images/churn-dashboard.jpg', alt: 'Churn dashboard overview', width: 1600, height: 1000 }
   ```
   Naming your photo `portrait.jpg` replaces the About placeholder with no code change. Update `width`/`height` in `profile.photo` to match the output the script prints.

### CV, Open Graph image, favicon

- Replace `public/cv/Toochukwu-Data-Analyst-CV.pdf` (or change `profile.cvUrl`).
- Edit `NAME`, `TAGLINE` and `URL_TEXT` at the top of `scripts/generate-assets.mjs`, then run `npm run assets` to regenerate the OG image and icons. Real photos/CVs are never overwritten unless you pass `--force`.

### Colours, fonts, theme

All design tokens are CSS variables at the top of `src/index.css` (`:root` = light, `.dark` = dark). The brand is **deep blue**: deep-navy surfaces in dark mode with an electric-blue accent (`#4f8cff`), and a royal-blue accent (`#1d4ed8`) in light mode. Every text/accent pair meets WCAG AA. Change `--accent` in both blocks to rebrand. Fonts are self-hosted via Fontsource (Space Grotesk, Inter, JetBrains Mono). The chart colours (`--chart-1` blue, `--chart-2` amber) were checked for colour-blind separation and contrast; re-validate them if you change them.

**Brand rule: background gradients appear only in the hero** (its grid, glows and headline highlight). Every other section uses flat surfaces; the `bg-grid`, `mask-radial` and `glow` utilities are reserved for the hero.

---

## 4. Connecting an API (Swagger / OpenAPI)

Components never import content directly. They call the service layer in `src/services/content.ts`:

```ts
getProfile()      → GET {VITE_API_BASE_URL}/profile          → Profile
getProjects()     → GET {VITE_API_BASE_URL}/projects         → Project[]
getProject(slug)  → GET {VITE_API_BASE_URL}/projects/{slug}  → Project
getSkills()       → GET {VITE_API_BASE_URL}/skills           → SkillGroup[]
getServices()     → GET {VITE_API_BASE_URL}/services         → Service[]
getStats()        → GET {VITE_API_BASE_URL}/stats            → Stat[]
getExperience()   → GET {VITE_API_BASE_URL}/experience       → TimelineEntry[]
getTestimonials() → GET {VITE_API_BASE_URL}/testimonials     → Testimonial[]
```

To switch on:

```bash
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_TIMEOUT_MS=6000
```

Behaviour:

- **No base URL** → local files, rendered instantly (no loading state).
- **Base URL set** → sections show **loading skeletons**, then the API data.
- **API slow, down, or returns the wrong shape** → the site falls back to the local files and shows a small *"Live data is unavailable… Retry"* notice. Nothing breaks.
- Responses must match the types in `src/types/content.ts`. If your OpenAPI schema differs, map it inside `content.ts` (e.g. `getProjects = () => loadWithFallback('/projects', projects, isValid).then(mapFromApi)`); components stay unchanged.
- Your API must allow CORS from your site's domain.

---

## 5. Contact form

No backend: messages are sent from the browser to a form service. Choose one with `VITE_FORM_PROVIDER`:

| Provider | Setup | Env vars |
|---|---|---|
| **Web3Forms** (default, easiest) | Get a free access key at web3forms.com | `VITE_FORM_PROVIDER=web3forms`, `VITE_WEB3FORMS_ACCESS_KEY` |
| **Formspree** | Create a form; copy the ID from `formspree.io/f/<ID>` | `VITE_FORM_PROVIDER=formspree`, `VITE_FORMSPREE_FORM_ID` |
| **EmailJS** | Create a service + template. Template variables: `name`, `email`, `project_type`, `budget`, `message`, `subject`, `reply_to` | `VITE_FORM_PROVIDER=emailjs`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` |

- In **dev without keys**, submissions are simulated so you can test the UI (the toast says so).
- In **production without keys**, visitors see an error toast that points them to your email.
- Includes field validation, focus on the first error, a honeypot spam trap, and success/error toasts.
- Service cards link to `/?service=<title>#contact`, which pre-selects the project type.

These keys are public by design (they ship to the browser). Restrict them to your domain in each provider's dashboard.

---

## 6. Deploying to Vercel

1. Push the project to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project**, then import the repo. The Vite framework preset is detected (`vercel.json` also sets `npm run build` → `dist`).
3. **Settings → Environment Variables**: add `VITE_SITE_URL` (your final URL, e.g. `https://toochukwu.dev`) plus your form provider keys (and `VITE_API_BASE_URL` if used).
4. Deploy. Redeploy after changing env vars; they're baked in at build time.
5. Custom domain: **Settings → Domains**. Then update `VITE_SITE_URL` and redeploy so canonical URLs, OG tags and the sitemap use it.
6. Submit `https://<your-domain>/sitemap.xml` in Google Search Console.

CLI alternative: `npm i -g vercel && vercel --prod`.

`vercel.json` rewrites every route to `index.html` (so `/projects/…` deep links work), caches hashed assets for a year, and adds basic security headers.

---

## 7. Performance and accessibility notes

- **3D hero**: `HeroVisual` shows a static isometric SVG immediately, waits for `requestIdleCallback`, loads the Three.js chunk only when the hero is near the viewport, cross-fades once the first frame renders, and pauses rendering when scrolled away. It never loads with `prefers-reduced-motion`, Save-Data, ≤2 CPU cores/≤2 GB RAM, or without WebGL. `PerformanceMonitor` lowers resolution on struggling GPUs.
- **Bundles**: only the React runtime is preloaded. The home page never downloads Recharts; case studies never download Three.js.
- **Motion**: every animation honours `prefers-reduced-motion` (Motion's `reducedMotion="user"` plus a CSS guard). The testimonial autoplay can be paused and stops on hover/focus.
- **Charts**: every chart has a legend that uses line style as well as colour, hover tooltips, and a **Table** toggle with the exact values.
- **Lighthouse**: run against the production build (`npm run build && npm run preview`), not the dev server.

---

## 8. Tech stack

React 18 · Vite 6 · TypeScript · Tailwind CSS 4 · Three.js + @react-three/fiber + @react-three/drei · Motion · Recharts · React Router 6 · lucide-react · Fontsource · sharp (build scripts only)
