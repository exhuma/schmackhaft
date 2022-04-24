export default {
  build: {
    emptyOutDir: false,
    outDir: "build/serviceworker/",
    target: "es2015",
    lib: {
      entry: "src/service_worker.ts",
      name: "service-worker",
      fileName: (format) => `service-worker.${format}.js`,
    },
  },
};
