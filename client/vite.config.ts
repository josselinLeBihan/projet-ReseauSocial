import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "tailwindcss"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.tsx",
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  define: {
    "process.env": process.env,
  },
})
