import { fileURLToPath } from "url";
export default {
  build: {
    sourcemap: true,
    outDir: "build/pages",
    rollupOptions: {
      input: {
        action_button: fileURLToPath(
          new URL("./src/views/action_button/index.html", import.meta.url)
        ),
      },
    },
  },
};
