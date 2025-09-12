import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    base:"/NivaasMitra/",
    port: 3000,
    open: true,

  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["./src/utils/animations.js", "./src/utils/propertyUtils.js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
