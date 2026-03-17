# SvelteKit Bug: `command()` returns `null` for `event.route.id` on rerouted pages

## Description

When using SvelteKit's experimental `command()` (remote functions) from a page that is served via a `reroute` hook, `event.route.id` inside the command is `null` instead of the matched route.

Page navigation correctly resolves `event.route.id` via the `reroute` hook. But when a `command()` is invoked from that same page, `event.route.id` is `null`.

## Setup

```bash
pnpm install
pnpm dev
```

## How to reproduce

1. Start the dev server with `pnpm dev`
2. Navigate to `http://localhost:5173/original`
   - The page loads correctly — the `reroute` hook maps `/original` → `/actual`
   - In the terminal, you'll see: `[hooks.server] GET /original → route.id: /actual`
3. Click the **"Call command()"** button
4. Observe the result displayed on the page

### Expected behavior

`event.route.id` → `/actual` (same as during page navigation)

### Actual behavior

`event.route.id` → `null`

Navigate to `/actual` directly and click the button to verify — in that case `event.route.id` is correctly `/actual`.

## Real-world impact

This breaks any `handle` hook logic that uses `event.route.id` for `command()` requests. In our production app we use subdomain-based routing via `reroute`:

```ts
// hooks.ts — reroutes acme.example.com/ → /o/acme
export const reroute: Reroute = ({ url }) => {
  const subdomain = getSubdomain(url.hostname);
  if (subdomain) return `/o/${subdomain}${url.pathname}`;
};
```

```ts
// hooks.server.ts — skips auth for static marketing pages
const handleAuth: Handle = async ({ event, resolve }) => {
  if (event.route.id?.includes('(static)')) return resolve(event);
  // ... set up session ...
};
```

When a `command()` is called from `acme.example.com/`, `event.route.id` is `null` instead of `/o/[slug]`. In our case the un-rerouted `/` path happened to match a `/(static)` route group, causing the auth hook to skip session setup.

## Key files

- `src/hooks.ts` — the `reroute` hook that maps `/original` → `/actual`
- `src/hooks.server.ts` — logs every request's `route.id` and `url.pathname`
- `src/routes/actual/+page.svelte` — page with a button that calls a `command()`
- `src/lib/get-route-info.remote.ts` — the server `command()` that returns `event.route` and `event.url`

## Environment

- SvelteKit 2.55.0
- Svelte 5.53.13
- Vite 8.0.0
- TypeScript 5.9.3
