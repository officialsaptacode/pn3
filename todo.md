# Gorkha Daily News App - Monorepo Migration TODO

This document outlines the steps to break down the single-file `index.html` prototype into a structured, scalable monorepo project.

## 📦 Phase 1: Monorepo & Project Setup
- [x] Initialize monorepo workspace (e.g., using Turborepo, Nx, or pnpm workspaces).
- [x] Create the main web application (`apps/web`) using a framework like Next.js or Nuxt.
- [x] Create a shared UI component library (`packages/ui`).
- [x] Create a shared configuration package (`packages/config`) for ESLint, Prettier, and TypeScript.
- [x] Extract CSS variables from `:root` into a design token system (e.g., Tailwind CSS config or CSS Modules).
- [x] Setup global fonts: `Noto Sans Devanagari`, `Mukta`, and `JetBrains Mono`.

## 🧩 Phase 2: Design System & Core Components (`packages/ui` with `shadcn/ui`)
- [x] **Typography & Layout**
  - [x] Section Heading (`.sh`, `.st`)
  - [x] Typography wrappers for paragraphs and titles.
- [x] **Buttons, Badges & Inputs**
  - [x] Standard Buttons (using shadcn `Button` for `.bp`, `.bg`, `.br`, `.sm2`)
  - [x] Badges/Tags (using shadcn `Badge` for `.b`, `.bsf`, `.tg`)
  - [x] Search Input & Newsletter Input (using shadcn `Input`)
- [x] **Cards & List Items**
  - [x] Standard Article Card (using shadcn `Card`)
  - [x] List Item Article (`.lst`, `.li`, `.lb`)
  - [x] Featured Category Article (`.cft`)
  - [x] Video Card (`.vc`, `.vt`)
  - [x] Opinion/Author Card (`.opi`)
- [x] **Interactive Elements**
  - [x] Ticker/Marquee component (for NEPSE and Breaking News)
  - [x] Filter Tabs (using shadcn `Tabs` for `.filters`, `.fp`)

## 🌐 Phase 3: Global State & Utilities (COMPLETED)
- [x] **Internationalization (i18n)**
  - [x] Set up language context/state (English `en` <-> Nepali `ne`).
  - [x] Replace `data-ne` and `data-en` HTML attributes with a proper i18n dictionary/JSON approach.
- [x] **Routing**
  - [x] Define the routing structure for all pages (Home, Category, Article, Search, Video, About).

## 🏗 Phase 4: Layouts & Navigation (`apps/web`) (COMPLETED)
- [x] **Header / Navbar**
  - [x] Main Desktop Navigation Bar (`nav`)
  - [x] Dropdown Menus for sub-categories (`.drop`)
  - [x] Top Controls: Search Button & Language Toggle
- [x] **Mobile Drawer**
  - [x] Hamburger Menu Button
  - [x] Mobile Drawer & Overlay (`.dr`, `.ov`)
  - [x] Drawer Navigation Links & Internal Search
- [x] **Global Bars**
  - [x] Breaking News Ticker (`.tkr`)
  - [x] NEPSE Live Scroller (`.nepse`)
- [x] **Footer**
  - [x] Main Footer (`.footer`) with Links, Socials, and Contact Info


## 📄 Phase 5: Page Implementation (`apps/web`) (COMPLETED)
- [x] **Home Page (`/`)**
  - [x] Hero Section (Featured Article + Sidebar Articles)
  - [x] Category Sections (Gorkha, Gandaki, National, Sports, Entertainment, etc.)
  - [x] Business Section (Tinted background layout)
  - [x] Video News Strip
  - [x] Newsletter Subscription Box
- [x] **Article Details Page (`/article/[slug]`)**
  - [x] Article Header (Breadcrumbs, Title, Meta, Share Buttons)
  - [x] Featured Image with Caption
  - [x] Article Body (Content, Blockquotes, Typography)
  - [x] Author Bio Box
  - [x] Related News Grid
  - [x] Sidebar Integration
- [x] **Category/Archive Page (`/category/[slug]`)**
  - [x] Category Header (Title, Subtitle, Article Count)
  - [x] Filter Tabs
  - [x] Featured Category Article
  - [x] Article Grid/List Layout with "Load More"
  - [x] Sidebar Integration (Most Read, Ads)
- [x] **Search Results Page (`/search`)**
  - [x] Search Input Header with Result Count
  - [x] Filter Tabs
  - [x] Search Results List with highlighted matching text (`.match`)
  - [x] Pagination controls (`.pgn`)
- [x] **Video News Page (`/video`)**
  - [x] Video Featured Player Area
  - [x] Video Gallery Grid
  - [x] Sidebar Integration (Most Watched)
- [x] **About Us / Contact Page (`/about`)**
  - [x] Company Introduction & Publisher Info
  - [x] Team Members Grid
  - [x] Contact Form
  - [x] Contact Information & Map Area

## 🚀 Phase 6: Data Integration & Polish (COMPLETED)
- [x] Define mock data schemas (JSON/TypeScript Interfaces) for Articles, Categories, NEPSE data, and Breaking News.
- [x] Wire up all components and pages to use the mock data instead of hardcoded HTML.
- [x] Ensure responsive design perfectly matches the original HTML breakpoints (1024px, 820px, 768px, 640px, 480px).
- [x] Accessibility pass (focus states, ARIA labels, semantic HTML).
- [x] Prepare API service layer for future backend integration.
