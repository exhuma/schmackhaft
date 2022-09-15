import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  files: ["test/e2e/**/*.test.ts", "test/e2e/**/*.spec.ts"],
  plugins: [esbuildPlugin({ ts: true })],
};
