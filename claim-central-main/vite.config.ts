import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

// Standard TanStack Start Vite config.
// Nitro is Vercel's zero-config deployment adapter for TanStack Start apps:
// as long as the nitro() plugin is present, Vercel auto-detects the framework
// and build/output settings, so no vercel.json is required.
export default defineConfig({
  resolve: {
    // Resolves the "@/*" path alias declared in tsconfig.json.
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    // TanStack Start's Vite plugin must come before React's Vite plugin.
    tanstackStart(),
    viteReact(),
    nitro(),
  ],
  // Use src/server.ts (our SSR error-wrapping entry) instead of TanStack
  // Start's default bundled server entry.
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./src/server.ts",
        },
      },
    },
  },
});
