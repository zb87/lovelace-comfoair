import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";

/**
 * Rollup plugin to inline SVG files as base64 data URIs.
 * Usage in source: import svgDataUri from './assets/heat.svg';
 */
function svgInline() {
  return {
    name: "svg-inline",
    load(id) {
      if (id.endsWith(".svg")) {
        const svg = readFileSync(id, "utf8");
        const base64 = Buffer.from(svg).toString("base64");
        const dataUri = `data:image/svg+xml;base64,${base64}`;
        return `export default "${dataUri}";`;
      }
      return null;
    },
  };
}

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/comfoair-card.ts",
  output: {
    file: "dist/comfoair-card.js",
    format: "iife",
    sourcemap: !production,
  },
  plugins: [
    svgInline(),
    resolve(),
    typescript(),
    production && terser(),
  ],
};
