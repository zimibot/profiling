import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import suidPlugin from "@suid/vite-plugin";
import path from 'path'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [solid(), suidPlugin(),  viteCompression({
    algorithm: 'gzip', // The compression algorithm to use
    // You can add more options here
  })],
  base: './',
  build: {
    target: "esnext",
    outDir: path.resolve(__dirname, 'build'),
    minify: 'terser',
  },

})
