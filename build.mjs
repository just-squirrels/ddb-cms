import { build } from "esbuild";

console.log("Building...");

await build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    minify: true,
    external: ['@aws-sdk/client-dynamodb'],
});

console.log("Done");
