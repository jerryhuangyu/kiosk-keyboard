import { resolve } from "node:path";
import { IS_DEV } from "@extension/env";
import { makeEntryPointPlugin } from "@extension/hmr";
import { getContentScriptEntries, withPageConfig } from "@extension/vite-config";
import { build as buildTW } from "tailwindcss/lib/cli/build";
import { build } from "vite";

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, "src");
// const matchesDir = resolve(srcDir, 'matches');

const configs = Object.entries(getContentScriptEntries(srcDir)).map(([name, entry]) => ({
  name,
  config: withPageConfig({
    mode: IS_DEV ? "development" : undefined,
    resolve: {
      alias: {
        "@src": srcDir,
      },
    },
    publicDir: resolve(rootDir, "public"),
    plugins: [IS_DEV && makeEntryPointPlugin()],
    build: {
      lib: {
        name: name,
        formats: ["iife"],
        entry,
        fileName: name,
      },
      outDir: resolve(rootDir, "..", "..", "dist", "content-ui"),
    },
  }),
}));

const builds = configs.map(async ({ name, config }) => {
  const folder = resolve(srcDir, name);
  const args = {
    "--input": resolve(folder, "index.css"),
    "--output": resolve(rootDir, "dist", name, "index.css"),
    "--config": resolve(rootDir, "tailwind.config.ts"),
    "--watch": IS_DEV,
  };
  await buildTW(args);
  //@ts-expect-error This is hidden property into vite's resolveConfig()
  config.configFile = false;
  await build(config);
});

await Promise.all(builds);
