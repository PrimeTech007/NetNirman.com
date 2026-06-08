# Net Nirman Full-Stack Platform

## Task 1: Project Scaffolding & Configuration
- Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
- Install all dependencies: `framer-motion`, `gsap`, `@studio-freight/lenis`, `mongoose`, `next-auth@5`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@tiptap/react`, `@tiptap/starter-kit`, `cloudinary`, `@phosphor-icons/react`, `recharts`, `bcryptjs`, `next-cloudinary`
- Configure `tailwind.config.ts` with Neo Brutalism theme (colors, fonts, box-shadow utilities, custom animations)
- Set up `.env.local` template with all required env vars
- Create global CSS with Neo Brutalism base styles (borders, shadows, button classes)
- Set up `next.config.js` with Cloudinary image domains

## Task 2: MongoDB Models & Database Layer
Create all Mongoose models in `lib/models/`:
- `User.ts` — users collection with bcrypt hooks, lockout fields
- `Inquiry.ts` — inquiries with status enum, notes array, refs
- `Client.ts` — clients with inquiryRef, company details
- `Project.ts` — projects with milestones, notes, files, caseStudy subdocs
- `SiteSettings.ts` — key-value settings store
- `Service.ts` — services_cms collection
- `Testimonial.ts` — testimonials collection
- `lib/db.ts` — MongoDB connection singleton with caching

## Task 3: Auth System (NextAuth v5)
- `lib/auth.ts` — NextAuth config with JWT strategy, credentials provider, bcrypt verify
- `lib/auth-options.ts` — session callbacks, JWT callbacks, role in token
- Middleware (`middleware.ts`) — protect `/admin/*` routes, redirect unauth to `/admin/login`
- Seed script for initial super_admin user (`scripts/seed-admin.ts`)

## Task 4: Shared Components & Layouts
Neo Brutalism component library in `components/ui/`:
- `Button.tsx` — yellow bg, black border, press-down hover (translateX/Y + shadow removal)
- `Card.tsx` — bordered, solid shadow, tilt variants for service cards
- `Input.tsx` / `Select.tsx` / `Textarea.tsx` — bordered form fields
- `Badge.tsx`, `Modal.tsx`, `Toast.tsx`, `Table.tsx`
- `Navbar.tsx` — logo left, links center, CTA right, mobile hamburger
- `Footer.tsx` — dark bg, 3-column layout
- `Marquee.tsx` — auto-scrolling black bg strip
- `AnimatedCounter.tsx` — count-up on scroll (Intersection Observer)
- `RootLayout.tsx` — Space Grotesk + Syne + Inter fonts, Lenis smooth scroll provider

## Task 5: Public API Routes
- `POST /api/inquiries` — Zod validated, rate limited (5/hr/IP), saves to MongoDB
- `GET /api/services` — visible services
- `GET /api/portfolio` — isPublic projects
- `GET /api/portfolio/[slug]` — single case study
- `GET /api/testimonials` — visible testimonials
- `GET /api/pricing` — pricing plans from site_settings
- `GET /api/site-settings/public` — marquee, stats, contact info
- Rate limiter utility in `lib/rate-limit.ts`

## Task 6: Admin API Routes — Auth & Inquiries
- `POST /api/auth/login` — credentials + brute force protection (5 attempts/15min lockout)
- `POST /api/auth/logout`, `GET /api/auth/session`
- `GET /api/admin/inquiries` — paginated, filterable (status/type/budget/date)
- `GET /api/admin/inquiries/[id]` — detail, auto-marks status to "read"
- `PATCH /api/admin/inquiries/[id]` — update status, add notes
- `POST /api/admin/inquiries/[id]/convert` — convert to client + project
- `GET /api/admin/inquiries/export` — CSV download

## Task 7: Admin API Routes — Projects & Clients
- Full CRUD for projects (`/api/admin/projects`)
- `PATCH /api/admin/projects/[id]/status` — Kanban drag update
- Milestones CRUD (`POST/PATCH /api/admin/projects/[id]/milestones`)
- Notes & files endpoints
- Full CRUD for clients (`/api/admin/clients`)
- `PATCH /api/admin/clients/[id]/status`

## Task 8: Admin API Routes — CMS
- CRUD for services (`/api/admin/cms/services`) + reorder
- CRUD for testimonials (`/api/admin/cms/testimonials`)
- Site settings GET/PUT (`/api/admin/site-settings`)

## Task 9: Public Website Pages
- `/` (Homepage) — Hero, marquee, about teaser, stats, services, portfolio preview, testimonials, CTA, footer
- `/services` — 6 alternating service rows with icons, features, tech tags
- `/work` — Filterable portfolio grid with category buttons
- `/work/[slug]` — Case study page (ISR revalidate:60)
- `/about` — Story, values cards, team grid, comparison table
- `/pricing` — 3 plan cards, feature comparison table, FAQ accordion
- `/contact` — Form (React Hook Form + Zod), WhatsApp button, address, hours

## Task 10: Admin Panel — Shell & Dashboard
- Admin layout with collapsible sidebar, top bar, user menu
- `/admin/login` — Login page with brute force messaging
- `/admin` — Dashboard with 4 KPI cards, Recharts bar chart (monthly inquiries), pie chart (project status), activity feed, quick actions

## Task 11: Admin Panel — Inquiries Module
- `/admin/inquiries` — Data table with filters, search, bulk actions, CSV export, pagination
- `/admin/inquiries/[id]` — Detail view with status dropdown, notes timeline, Convert to Client/Project buttons

## Task 12: Admin Panel — Projects Module
- `/admin/projects` — Project table with add slide-over form (Tiptap description, tag input, Cloudinary upload)
- `/admin/projects/kanban` — 5-column drag-drop board (dnd-kit or react-beautiful-dnd), overdue indicators
- `/admin/projects/[id]` — Tabbed view: Overview, Milestones (progress bar), Notes timeline, Files upload, Client info

## Task 13: Admin Panel — Clients Module
- `/admin/clients` — Table with add form, Cloudinary logo upload
- `/admin/clients/[id]` — Tabs: Overview, Projects list, Notes, Financial summary

## Task 14: Admin Panel — CMS & Settings
- `/admin/website/services` — CRUD table, drag reorder, visibility toggle
- `/admin/website/portfolio` — Toggle isPublic/isFeatured, case study editor, reorder
- `/admin/website/testimonials` — CRUD, visibility, reorder
- `/admin/website/pricing` — Edit plans, FAQ CRUD
- `/admin/website/seo` — Per-page meta editor
- `/admin/website/settings` — Announcement bar, marquee text, contact info, socials, stats, maintenance mode
- `/admin/users` (super_admin only) — User CRUD, role assignment

## Task 15: Zustand State & Polish
- Zustand stores: `useAuthStore`, `useInquiryStore`, `useProjectStore`, `useUIStore` (sidebar, toasts, modals)
- Toast notification system
- Loading skeletons for all pages
- Mobile responsiveness pass on all pages
- Seed scripts for demo data (services, testimonials, sample projects)

## Implementation Order
Tasks 1-3 first (foundation), then 4-5 (components + public APIs), then 6-8 (admin APIs), then 9 (public pages), then 10-14 (admin panel), finally 15 (polish).
