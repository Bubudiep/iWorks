import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    esbuild: {
      target: 'es2017', // Hoặc 'es2022'
    },
    root: "./src",
    base: "",
    plugins: [react()],
  });
};
