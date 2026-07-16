import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const isDev = process.env.CARD_ENV === "dev" || Boolean(process.env.ROLLUP_WATCH);
const production = !isDev;

const cardTag = isDev ? "comfoair-card-test" : "comfoair-card";
const outputFile = isDev ? "dist/comfoair-card-test.js" : "dist/comfoair-card.js";

function cardTagPlugin(tag) {
  return {
    name: "card-tag-replace",
    transform(code, id) {
      if (id.includes("src")) {
        return {
          code: code.replace(/CARD_TAG_PLACEHOLDER/g, tag),
          map: null,
        };
      }
    },
  };
}

export default {
  input: "src/comfoair-card.ts",
  output: {
    file: outputFile,
    format: "iife",
    sourcemap: !production,
  },
  treeshake: false,
  plugins: [
    resolve(),
    typescript(),
    cardTagPlugin(cardTag),
    production && terser(),
  ],
};
