import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteCompression()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk untuk library inti React
          react: ["react", "react-dom", "react-router-dom"],

          // Chunk untuk react-query (gunakan salah satu: react-query atau @tanstack/react-query)
          query: [
            "@tanstack/react-query", // gunakan ini jika pakai versi terbaru
            // "react-query" // uncomment jika pakai versi lama
          ],

          // Chunk untuk PDF viewer
          pdf: ["react-pdf", "pdfjs-dist"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Naikkan batas agar warning tidak muncul
  },
  server: {
    port: 5173,
    host: true, // supaya bisa diakses dari luar localhost
    allowedHosts: ['eduforge.test'], // tambahkan domain lokalmu
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
});
