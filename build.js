const fs = require('fs')
const path = require('path')
const esbuild = require('esbuild')

const functionsDir = ""
const outDir = "dist/src/"

const entryPoints = ['./index.ts']


esbuild.build({
  entryPoints,
  bundle: true,
  outdir: path.join(__dirname, outDir),
  outbase: functionsDir,
  platform: 'node',
//   sourcemap: 'external',
  sourcemap: 'inline',
  keepNames: true,
  // minify : true
})