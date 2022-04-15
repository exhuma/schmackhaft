import { fileURLToPath } from "url";
export default {
  build: {
    sourcemap: true,
    outDir: "build/pages",
    rollupOptions: {
      input: {
        background: fileURLToPath(
          new URL("./src/core/background/index.html", import.meta.url)
        ),
        sidebar: fileURLToPath(
          new URL("./src/views/sidebar/index.html", import.meta.url)
        ),
        popup: fileURLToPath(
          new URL("./src/views/popup/index.html", import.meta.url)
        ),
        options: fileURLToPath(
          new URL("./src/views/options/index.html", import.meta.url)
        ),
      },
    },
  },
};
