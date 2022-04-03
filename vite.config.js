export default {
  build: {
    outDir: "extension/components",
    lib: {
      entry: "web-components/app-schmackhaft.ts",
      name: "Schmackhaft",
      fileName: (format) => `app-schmackhaft.${format}.js`,
    },
  },
};
