import path from "node:path";
import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import esbuild from "esbuild";
import * as sass from "sass-embedded";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from "node:url";

const {
  values: { watch },
} = parseArgs({
  options: {
    watch: {
      type: "boolean",
      short: "w",
      default: false,
    },
  },
});

const sassPlugin = (): esbuild.Plugin => ({
  name: "sass",
  setup: (build) => {
    build.onLoad({ filter: /\.scss$/ }, async (args) => {
      const result = await sass.compileAsync(args.path, {
        loadPaths: ["./node_modules"],
        logger: { warn() {} },
      });
      return {
        loader: "css",
        contents: result.css,
        resolveDir: path.dirname(args.path),
        watchFiles: result.loadedUrls
          .filter((url) => url.protocol === "file:")
          .map((url) => fileURLToPath(url)),
      };
    });
  },
});

const postcssPlugin = (plugins?: postcss.AcceptedPlugin[]): esbuild.Plugin => ({
  name: "postcss",
  setup: (build) => {
    let processor: postcss.Processor;

    build.onStart(() => {
      processor = postcss(plugins ?? []);
    });

    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const source = await fs.readFile(args.path, "utf8");
      const result = await processor.process(source, { from: args.path });
      return {
        loader: "css",
        contents: result.css,
        resolveDir: path.dirname(args.path),
        watchFiles: result.messages
          .filter((message) => message.type === "dependency")
          .map((message) => message.file),
      };
    });
  },
});

const ctx = await esbuild.context({
  entryPoints: ["./resources/ts/main.ts"],
  outdir: "./public/output",
  plugins: [sassPlugin(), postcssPlugin([autoprefixer()])],
  loader: {
    ".svg": "file",
    ".eot": "file",
    ".ttf": "file",
    ".woff": "file",
    ".woff2": "file",
  },
  bundle: true,
  minify: true,
  entryNames: "[name]",
});

const build = async (watch: boolean = false) => {
  if (watch) {
    await ctx.watch();
    return;
  }
  await ctx.rebuild();
  await ctx.dispose();
};

build(watch);
