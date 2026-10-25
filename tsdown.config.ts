import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: 'src/index.ts',
    format: ['esm', 'cjs'],
    platform: 'browser',
    target: 'es2020',
    dts: true,
    outputOptions: { exports: 'named' },
  },
  {
    // Script tag and AMD build, exposes the function as `captureVideoFrame`.
    entry: { 'capture-video-frame': 'src/umd.ts' },
    format: 'umd',
    platform: 'browser',
    target: 'es2020',
    globalName: 'captureVideoFrame',
    minify: true,
  },
]);
