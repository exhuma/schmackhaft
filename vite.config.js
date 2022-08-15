const isProduction = process.env.NODE_ENV === "production";
export default {
  build: {
    sourcemap: !isProduction,
    outDir: "build",
    rollupOptions: {
      input: {
        action_button: "./src/views/action_button/index.html",
      },
    },
  },
};
