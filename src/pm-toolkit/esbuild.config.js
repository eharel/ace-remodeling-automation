// esbuild.config.js
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/index.ts"], // or your real entry point
    bundle: true,
    outfile: "build/code.js",
    platform: "browser",
    target: "es2020",
    format: "iife", // wrap everything in an IIFE (good for Apps Script)
    globalName: "globalThis", // ensures global function registration works
  })
  .catch(() => process.exit(1));
