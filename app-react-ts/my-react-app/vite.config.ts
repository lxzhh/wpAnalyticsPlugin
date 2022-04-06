import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "build.js",
        assetFileNames: (assetInfo) => {
          // console.log(assetInfo);
          let extType = assetInfo.name.split(".")[1];

          if (/css/i.test(extType)) {
            return `main.css`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
  plugins: [react()],
});
