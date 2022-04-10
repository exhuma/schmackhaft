export default {
  build: {
    emptyOutDir: false,
    outDir: "dist/",
    target: "es2015",
    lib: {
      entry: "src/service_worker.js",
      name: "service-worker",
      fileName: (format) => `service-worker.${format}.js`,
    },
  },
};
