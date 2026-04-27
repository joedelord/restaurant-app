/**
 * Vite Configuration
 *
 * Main configuration file for the frontend build tool (Vite).
 *
 * Responsibilities:
 * - Configures React support via Vite plugin
 * - Integrates Tailwind CSS into the build process
 * - Defines module resolution settings (e.g. path aliases)
 * - Controls development and production build behavior
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
