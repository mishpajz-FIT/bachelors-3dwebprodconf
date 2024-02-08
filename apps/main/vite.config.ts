import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Check if the module ID contains "three/build/three.module.js"
          if (id.includes("three/build/three.module.js")) {
            // Return a custom chunk name for the Three.js module
            return "three";
          }
        },
      },
    },
  },
});
