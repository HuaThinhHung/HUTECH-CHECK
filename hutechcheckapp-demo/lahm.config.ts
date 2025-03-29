import legacy from "@lahmjs/plugin-legacy";
import kdu from "@lahmjs/plugin-kdu";
import { LahmPWA } from "lahm-plugin-pwa";
import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "lahm";

dotenv.config();

// https://lahmjs.web.app/config/
export default defineConfig({
  plugins: [
    kdu({
      // template: {
      //   compilerOptions: {
      //     isCustomElement: (tag) => {
      //       return tag.startsWith("fml-");
      //     },
      //   },
      // },
    }),
    legacy(),
    LahmPWA({ registerType: "autoUpdate" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    minify: true,
    cssMinify: true,
  },
});
