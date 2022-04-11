import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        nested: resolve(__dirname, "static-data-page/index.html"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          console.log("chunkInfo", chunkInfo.facadeModuleId);
          if (chunkInfo.facadeModuleId.includes("static-data-page")) {
            return "static-data-page.js";
          } else {
            return "build.js";
          }
        },
        chunkFileNames: (chunkInfo) => {
          console.log("chunkFileNames", chunkInfo.facadeModuleId);
          return "vendor.js";
        },
        assetFileNames: (assetInfo) => {
          // console.log(assetInfo);
          let extType = assetInfo.name.split(".")[1];

          if (/css/i.test(extType)) {
            return "[name][extname]";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
  plugins: [react()],
});
