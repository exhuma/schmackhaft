const isProduction = process.env.NODE_ENV === "production";
export default {
  build: {
    sourcemap: !isProduction,
    outDir: "build",
    rollupOptions: {
      input: {
        action_button: "./src/views/action_button/index.html",
        background: "./src/background.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            // The background-page is referenced in the manifest.json and
            // therefore needs a stable filename
            return "background.js";
          }
          return "[name].[hash].js";
        },
      },
    },
  },
  test: {
    include: ["test/unit/**/*.test.ts"],
    coverage: {
      provider: "c8",
      include: ["src/**/*.ts"],
      exclude: [
        // "settings.ts" contains a bridge that relies on side-effects. Testing
        // this is more complicated than the implementation itself. Hence we
        // ignore it.
        "src/core/settings.ts",
      ],
      all: true,
    },
  },
};
