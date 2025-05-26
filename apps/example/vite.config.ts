import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-use-scroll-direction/",
  plugins: [react()],
  server: {
    port: 3000, // Optional: specify a port for the dev server
  },
});
