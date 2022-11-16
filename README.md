# capture-video-frame

A micro-library for taking screenshots from a running HTML5 video.

## Installation

```bash
$ npm install --save capture-video-frame
```

or

```bash
$ yarn add capture-video-frame
```

## Example

HTML:

```html
<video id="my-video" autoplay>
  <source src="movie.mp4" type="video/mp4" />
</video>

<img id="my-screenshot" />
```

JavaScript:

```js
import captureVideoFrame from "capture-video-frame";

// ...

// Call captureVideoFrame() when you want to record a screenshot
const frame = captureVideoFrame("my-video-id", "png");

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

## Browser support

Tested on current Chrome and Firefox.

## API

#### `captureVideoFrame(source, format, quality)`

#### Parameters

`source` (element or string, mandatory) Source video. If string, id of the element.

`format` (string, optional) Output image format. Can be either `png` or `jpeg`. `png` is the default.

`quality` (number, optional) A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. The default value is 0.92.

#### Return value

- Object with `blob`, `dataUri`, and `format` properties if the capture succeeded
- `false` if the capture failed.

Image blob can be easily uploaded to the server using XHR2 FormData API.

Image data URI can be easily set as `<img>` `src` attribute to show the captured image.

## License

MIT
