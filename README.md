# capture-video-frame

A micro-library for taking screenshots from a running HTML5 video.

## Installation

```bash
npm install capture-video-frame
```

or

```bash
yarn add capture-video-frame
```

The package ships ES module and CommonJS builds with TypeScript types. For a plain `<script>` tag, use the UMD build, which defines a global `captureVideoFrame` function:

```html
<script src="https://unpkg.com/capture-video-frame@2"></script>
```

## Example

HTML:

```html
<video id="my-video" autoplay muted>
  <source src="movie.mp4" type="video/mp4" />
</video>

<img id="my-screenshot" />
```

JavaScript:

```js
import captureVideoFrame from "capture-video-frame";

// ...

// Call captureVideoFrame() when you want to record a screenshot
const frame = captureVideoFrame("my-video", "png");

// Show the image
const img = document.getElementById("my-screenshot");
img.setAttribute("src", frame.dataUri);

// Upload the image
const formData = new FormData();
formData.append("file", frame.blob, `my-screenshot.${frame.format}`);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});
```

`captureVideoFrameAsync()` does the same without blocking on image encoding and without building a data URI, which is faster for large videos:

```js
import { captureVideoFrameAsync } from "capture-video-frame";

const frame = await captureVideoFrameAsync("my-video", "webp");

img.setAttribute("src", URL.createObjectURL(frame.blob));
```

## Browser support

All current browsers. The video must be loaded from the same origin as the page, or served with CORS headers and the `crossorigin` attribute set on the `<video>` element. Otherwise the browser blocks reading the frame and the capture throws a `SecurityError`.

## API

### `captureVideoFrame(video, format, quality)`

#### Parameters

`video` (element or string, mandatory) Source video. If a string, the id of the element.

`format` (string, optional) Output image format: `jpeg`, `png`, or `webp`. `jpeg` is the default.

`quality` (number, optional) A number between 0 and 1 indicating image quality for `jpeg` and `webp`. The default value is 0.92.

#### Return value

- Object with `blob`, `dataUri`, and `format` properties if the capture succeeded.
- `false` if the capture failed: the video doesn't exist, has no frame loaded yet, or the format is unknown.

`format` is the format of the returned image. A browser that can't encode the requested format returns `png` instead.

The blob can be uploaded to a server with `FormData` and `fetch()`.

The data URI can be set as the `src` attribute of an `<img>` to show the captured image.

### `captureVideoFrameAsync(video, format, quality)`

Takes the same parameters. Returns a promise of an object with `blob` and `format` properties, or `false` if the capture failed.

## Development

```bash
npm install
npm test
npm run build
```

## License

MIT
