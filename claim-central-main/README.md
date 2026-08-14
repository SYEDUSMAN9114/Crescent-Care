# Claim Central

A modern claims intimation workspace for health insurance officers — view existing
claims, drill into a single claim, and submit new claims through a redesigned,
streamlined UI.

Built with [TanStack Start](https://tanstack.com/start), TanStack Router, React 19,
Tailwind CSS, and shadcn/ui components.

## Development

You'll need Node.js 20+ installed.

```sh
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Build

```sh
npm run build
```

This produces a production build via Vite/Nitro in the `.output` directory.

## Deploying to Vercel

This project uses [Nitro](https://nitro.build) as its server adapter, which Vercel
detects automatically for TanStack Start apps — no extra configuration is required.

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will detect the framework and deploy automatically. Every subsequent push
   to the connected branch triggers a new deployment.

You can also deploy from the CLI:

```sh
npm i -g vercel
vercel
```

## Project structure

- `src/routes` — file-based routes (TanStack Router)
- `src/components` — UI components
- `src/lib` — shared utilities
- `src/hooks` — shared React hooks
- `src/server.ts` — custom SSR entry (wraps error handling around the default
  TanStack Start server entry)
- `src/start.ts` — server middleware (CSRF protection, error handling)
