# Changelog

## 2.0.0 - 2026-10-25

- Ship ES module, CommonJS, and UMD builds with TypeScript types. The default import now works in bundlers.
- `require()` still exposes `captureVideoFrame`, and the UMD build keeps the `captureVideoFrame` global and AMD support.
- Breaking: the `capture-video-frame/capture-video-frame.js` path is gone. Use the package name, or `dist/capture-video-frame.umd.js` for a script tag.
- Add `webp` output. The returned `format` is the format the browser actually encoded.
- Add `captureVideoFrameAsync()`, based on `canvas.toBlob()`.
- Return `false` when the video has no frame loaded yet.
- Respect a `quality` of 0.
- Remove Bower support.

## 1.0.0 - 2020-08-19

- Declare the API stable. No code changes.

## 0.1.3 - 2018-02-14

- Add the `quality` parameter, defaulting to 0.92.

## 0.1.2 - 2017-07-17

- Fix the MIME type passed to the canvas. `jpeg` captures used to produce PNG images.

## 0.1.1 - 2015-08-09

- Add Bower support.

## 0.1.0 - 2015-08-08

- First release.
