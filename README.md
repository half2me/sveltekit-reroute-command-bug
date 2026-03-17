# SvelteKit Bug: `command()` (remote functions) ignores the `reroute` hook

## Description

When using SvelteKit's experimental `command()` (remote functions) from a page that is served via a `reroute` hook, the server-side `event.route.id` and `event.url.pathname` reflect the **original (un-rerouted) URL** instead of the rerouted one.

This means server code running inside a `command()` sees a different request context than the same code would see during normal page rendering.

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

The `command()` should see the same rerouted request context as a normal page load:
- `event.route.id` → `/actual`
- `event.url.pathname` → `/actual`

### Actual behavior

The `command()` sees the **un-rerouted** URL:
- `event.route.id` → `null`
- `event.url.pathname` → `/original`

You can verify by navigating to `/actual` directly and clicking the button — in that case, the `command()` correctly returns `route.id: /actual` and `pathname: /actual`.

## Real-world impact

This bug breaks any `handle` hook logic that relies on `event.route.id` for `command()` requests. For example, in our production app we use subdomain-based routing via `reroute`:

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

When a `command()` is called from `acme.example.com/`, the server sees `event.route.id` as the un-rerouted `/` (which matches `/(static)`) instead of `/o/[slug]`. This causes the auth hook to skip session setup, breaking any server function that needs the session (e.g., CAPTCHA verification for logged-in users).

## Key files

- `src/hooks.ts` — the `reroute` hook that maps `/original` → `/actual`
- `src/hooks.server.ts` — logs every request's `route.id` and `url.pathname`
- `src/routes/actual/+page.svelte` — page with a button that calls a `command()`
- `src/lib/get-route-info.remote.ts` — the server `command()` that returns `event.route.id` and `event.url.pathname`

## Environment

- SvelteKit with `experimental.remoteFunctions: true`
- `compilerOptions.experimental.async: true`
- Svelte 5, TypeScript
