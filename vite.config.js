import { fileURLToPath } from "url";
export default {
  build: {
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        app_schmackhaft: fileURLToPath(
          new URL("./src/web-components/app-schmackhaft.ts", import.meta.url)
        ),
        sidebar: fileURLToPath(
          new URL("./src/sidebar/index.html", import.meta.url)
        ),
        popup: fileURLToPath(
          new URL("./src/popup/index.html", import.meta.url)
        ),
        options: fileURLToPath(
          new URL("./src/options/index.html", import.meta.url)
        ),
        background: fileURLToPath(
          new URL("./src/background/index.html", import.meta.url)
        ),
      },
    },
  },
};
