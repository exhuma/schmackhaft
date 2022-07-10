import { fileURLToPath } from "url";
export default {
  build: {
    sourcemap: true,
    outDir: "build/pages",
    rollupOptions: {
      input: {
        sidebar: fileURLToPath(
          new URL("./src/views/action_button/index.html", import.meta.url)
        ),
      },
    },
  },
};
