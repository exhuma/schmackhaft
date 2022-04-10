import { fileURLToPath } from "url";
export default {
  build: {
    sourcemap: true,
    outDir: "dist",
    rollupOptions: {
      input: {
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
