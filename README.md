<img src="https://cdn.pixabay.com/photo/2023/09/22/07/53/ai-generated-8268380_1280.jpg" alt="BFT-Logo" margin="auto 0px"/>
- by renatonutri

# project-picanha

A small React + TypeScript learning project using Vite, Tailwind CSS v4, shadcn/ui, TanStack Query, react-i18next, and the public Coinbase API.

Goal:

- Practice modern React (hooks, TS)
- Practice data fetching and server state management
- Practice theming + accessibility (contrast, font size, font family)
- Practice i18n (German / English)
- Practice Git/GitHub workflows with multiple branches

No real customer data, no company IP. Pure sandbox.

Primary Roadmap helper and cheatsheets: 

- React Roadmap 2025: https://roadmap.sh/react

- TypeScript Roadmap 2025: https://roadmap.sh/typescript

- GitHub Git cheatsheet: https://education.github.com/git-cheat-sheet-education.pdf

- Conventional commits: https://www.conventionalcommits.org/en/v1.0.0/

- Git cheatsheet: https://git-scm.com/cheat-sheet

- NPM cheatsheet: https://devhints.io/npm

- Git branch cheatsheet: https://devhints.io/git-branch

- Git tricks: https://devhints.io/git-tricks

- Git revisions: https://devhints.io/git-revisions

---

## 1. System requirements (Windows)

### 1.1 Required software

Install these once on your machine:

**Node.js (LTS 20+ or 22+)**  

Download: https://nodejs.org/en/download  
After install:

   ```
   bash
   node -v
   npm -v
  ```
**Git**

Download: https://git-scm.com/downloads
After install:

```
git --version
```

**Visual Studio Code**

Download: https://code.visualstudio.com/download

**Browser**

Chrome, Edge or Firefox (for devtools and local testing).

---

## 2. Repository setup (clone → install → run)

### 2.1 Clone the repository

Open PowerShell (or terminal):

```
cd C:\ByBernardo-BFT\React    # adjust to your local projects folder

git clone https://github.com/BFTorres/project-picanha.git
cd project-picanha
```

### 2.2 Install dependencies

From the project root:

```
npm install
```

This will install:

- Vite, React, TypeScript

- Tailwind CSS v4 + @tailwindcss/vite

- shadcn/ui (Radix-based UI components)

- @tanstack/react-query

- i18next + react-i18next

- tslib

-Other tooling

### 2.3 Environment variables

We use a .env file for configuration, currently only for the Coinbase API base URL.

Create a local .env using the example:

```
copy .env.example .env
```

Default content (keep it unless you have a reason to change it):

```
VITE_API_BASE_URL=https://api.coinbase.com/v2
```

VITE_API_BASE_URL is read via import.meta.env.VITE_API_BASE_URL in the code.

### 2.4 Run the dev server

```
npm run dev
```

Vite outputs a local URL, usually: http://localhost:5173
Open it in your browser.

### 2.5 Build for production

```
npm run build
```

Outputs production bundles to dist/. That directory is what you’d deploy to a static host.

## 3. Git & GitHub workflow

Repository branches:

- master – our production

- bernardo – personal branch

- adam – personal branch

- michael – personal branch

### 3.1 Check branches

Local branches:

```
git branch
# master
# bernardo
# adam
# michael
```

Remote branches:

```
git branch -r
# origin/master
# origin/bernardo
# origin/adam
# origin/michael
```

### 3.2 Typical workflow (per person)

Switch to your branch

```
git checkout bernardo   # or adam / michael
```

Update your branch

```
git pull
```

Develop

- Run: npm run dev

- Change code, test in browser

Stage and commit

```
git status              # check changes
git add .               # or only specific files
git commit -m "feat: short description"

```
Push

```
git push origin bernardo
```

Open Pull Request into master when you want your changes merged.

### 3.3 Rules

- No direct commits to master. Always through a PR from your branch.

- Keep commits relatively small and self-contained.

- Run npm run dev before pushing.

- Fix merge conflicts locally and keep master clean.

## 4. Repo configuration files

### 4.1 .gitignore

This file should be in the repo root and is already configured to ignore noise:

```
# dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# build output
dist/
.vite/

# local env
.env
.env.local
.env.*.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# editor configs
.vscode/
.idea/
*.swp
*.swo

# OS junk
.DS_Store
Thumbs.db
desktop.ini

# coverage
coverage/
```

Why:

- No node_modules/ in Git.

- No build output.

- No local .env files (secrets / machine-specific).

- Ignore IDE and OS junk.

### 4.2 .env.example

Template for local .env files. This is committed:

```
# Example environment variables for project-picanha.
# Copy this file to `.env` for local development.

VITE_API_BASE_URL=https://api.coinbase.com/v2
# VITE_SOME_FUTURE_KEY=your-key-here
```

Usage:

- Developers copy .env.example to .env.

- .env is ignored by Git (.gitignore).

## 5. Tech stack and rationale

### 5.1 Vite

What it is:
Build tool + dev server for modern web projects.

Why:

- Very fast dev server with HMR.

- Simple config.

- Works well with TypeScript and React.

Docs:

- Vite: https://vite.dev

### 5.2 React + TypeScript

What it is:
React for UI components; TypeScript for static typing.

Why:

- React function components + hooks are the standard.

- TS catches type errors at compile time.

- Good DX and maintainability for team work.

Docs:

- React: https://react.dev

- TypeScript: https://www.typescriptlang.org/docs/

### 5.3 Tailwind CSS v4

What it is:
Utility-first CSS framework.

How we use it:

- Integrated via @tailwindcss/vite.

- src/index.css contains:

```
@import "tailwindcss";
```

- We define class-based themes:

  .app-theme-light, .app-theme-dark, .app-theme-contrast

  .app-font-sans, .app-font-serif, .app-font-mono

  .app-font-size-sm, .app-font-size-md, .app-font-size-lg

Docs:

- Tailwind CSS docs: https://tailwindcss.com/docs

- Tailwind v4 announcement: https://tailwindcss.com/blog/tailwindcss-v4

- Tailwind upgrade guide: https://tailwindcss.com/docs/upgrade-guide

### 5.4 shadcn/ui + Radix

What it is:

- Radix UI: Accessible low-level primitives (Select, Dialog, etc.).

- shadcn/ui: Component templates built on Radix + Tailwind, meant to be copied into your our codebase.

How we use it:

- UI primitives: Button, Card, Input, Label, Select, Switch, Skeleton, etc.

- Used in:

  - Topbar (navigation, theme switch, language select)

  - Dashboard cards

  - Accessibility panel

Why:

- Accessibility: Radix handles a lot of ARIA + keyboard interaction for you.

- Styling: Tailwind-based, no extra CSS-in-JS layer.

Docs:

- shadcn/ui docs: https://ui.shadcn.com/docs

- shadcn/ui component gallery: https://www.shadcn.io/ui

- Radix UI: https://www.radix-ui.com/

### 5.5 TanStack Query (React Query)

What it is:
Library for managing server state (data from APIs) in React.

How we use it:

- In main.tsx: create a QueryClient and wrap the app with <QueryClientProvider>.

- In CoinbaseRatesCard: useQuery to load exchange rates.

Why:

- Handles caching, loading and error states.

- Manages stale data, refetch intervals, and retries.

- Much better than handwritten useEffect + fetch + useState for anything non-trivial.

Docs:

- TanStack Query: https://tanstack.com/query

- React Query overview: https://tanstack.com/query/v5/docs/react/overview

- React Query quick start: https://tanstack.com/query/v5/docs/react/quick-start

### 5.6 i18next + react-i18next

What it is:

- i18next – general i18n framework.

- react-i18next – React bindings (hooks and components).

How we use it:

- src/i18n.ts defines resources for German (de) and English (en).

- useTranslation() hook used throughout:

  - Topbar (labels, nav)

  - DashboardPage headings

  - ImprintPage text

Why:

- Native support for pluralization, fallbacks, interpolation.

- Easy to scale beyond two languages.

- Clean separation of translation keys and UI.

Docs:

- i18next: https://www.i18next.com/

- i18next getting started: https://www.i18next.com/overview/getting-started

- react-i18next: https://react.i18next.com/

- react-i18next quick start: https://react.i18next.com/guides/quick-start

## Coinbase API

We use public, unauthenticated Coinbase endpoints; no API keys, no login, no user data.

### 6.1 Endpoint used

Exchange rates:

```
GET https://api.coinbase.com/v2/exchange-rates?currency=EUR
```

From Coinbase docs:

- Returns current exchange rates for the given base currency.

- Default base is USD if not specified.

- No authentication required for this endpoint.

Docs:

- Data API: https://www.coinbase.com/en-de/developer-platform/products/data-api

- Exchange rates endpoint: https://docs.cdp.coinbase.com/coinbase-business/track-apis/exchange-rates

## 6.2 Response shape and usage

Simplified response:

```
{
  "data": {
    "currency": "EUR",
    "rates": {
      "BTC": "0.00002",
      "ETH": "0.0003",
      "USD": "1.08",
      "...": "..."
    }
  }
}
```

In this project:

- Base currency is EUR.

- We pick a subset of rates (BTC, ETH, USD, EUR) to display.

- We only display numbers; we do not store anything user-specific.

No private accounts, no trading actions, no keys.

## 7. VS Code extensions (recommended)

Install these from the VS Code Marketplace:

1. ESLint

- JS/TS linting in the editor.

- Catches common mistakes and style issues.

2. Prettier – Code formatter

- Auto formatting on save.

- Keeps style consistent across the team.

3. Tailwind CSS IntelliSense

- Autocomplete for Tailwind classes.

- Hover previews of utilities.

4. GitLens — Git supercharged

- Shows who changed what line and when.

- Useful for team collaboration.

5. (Built-in) TypeScript and JavaScript Language Features

- Keep enabled. Provides IntelliSense, refactoring, and diagnostics for TS/JS.

Optional:

- VSCode Icons – better icons for file types.

- Error Lens – highlights errors/warnings directly inline.

## 8. Documentation and download links (summary)

### Core tools:

Node.js download: https://nodejs.org/en/download

Git download: https://git-scm.com/downloads

Visual Studio Code download: https://code.visualstudio.com/download

### Vite / React / TypeScript:

Vite: https://vite.dev

React: https://react.dev

TypeScript docs: https://www.typescriptlang.org/docs/

### Styling / UI:

Tailwind CSS docs: https://tailwindcss.com/docs

Tailwind v4 announcement: https://tailwindcss.com/blog/tailwindcss-v4

Tailwind upgrade guide: https://tailwindcss.com/docs/upgrade-guide

shadcn/ui docs: https://ui.shadcn.com/docs

shadcn/ui components: https://www.shadcn.io/ui

Radix UI: https://www.radix-ui.com/

### State / data fetching:

TanStack Query main site: https://tanstack.com/query

React Query overview: https://tanstack.com/query/v5/docs/react/overview

React Query quick start: https://tanstack.com/query/v5/docs/react/quick-start

### Internationalization:

i18next: https://www.i18next.com/

i18next getting started: https://www.i18next.com/overview/getting-started

react-i18next: https://react.i18next.com/

react-i18next quick start: https://react.i18next.com/guides/quick-start

### Coinbase APIs:

Data API: https://www.coinbase.com/en-de/developer-platform/products/data-api

Exchange rates endpoint: https://docs.cdp.coinbase.com/coinbase-business/track-apis/exchange-rates

## 9. Next steps (optional exercises)

Ideas for expanding the project while keeping it generic:

1. Watchlist CRUD

- Local list of currency codes (e.g. BTC, ETH, SOL) with notes.

- Implement add/edit/delete using React state.

- Then move to a mock backend (JSON server) + TanStack Query mutations.

2. Persist settings

- Save theme, fontSize, fontFamily, language in localStorage.

- Load them on app startup.

- This mimics user preference handling in real apps.

3. Additional public APIs

- Add another crypto or FX API.

- Compare values from multiple sources.

- Practice error handling, retries, fallback logic.

All of this remains safe (no real users, no customer data) but matches patterns used in real-world

