# capture-video-frame

A micro-library for taking screenshots from a running HTML5 video. Built to work together with [getUserMedia.js](https://github.com/addyosmani/getUserMedia.js/)

## Installation

```bash
$ npm install --save capture-video-frame
```

## Example

HTML:

```html
<script src="capture-video-frame.js"></script>

<video id="my-video" autoplay>
  <source src="movie.mp4" type="video/mp4">
</video>

<img id="my-screenshot" />
```

JavaScript:

```js
var frame = captureVideoFrame('my-video', 'png');

// Show the image
var img = document.getElementById('my-screenshot');
img.setAttribute('src', frame.dataUri);

// Upload the image...
var formData = new FormData();
formData.append('file', frame.blob, 'my-screenshot.' + frame.format);

// ...with plain JS
var request = new XMLHttpRequest();
request.open('POST', '/api/upload', true);
request.setRequestHeader('Content-Type', 'application/multipart/form-data; charset=UTF-8');
request.send(formData);

// ...or with jQuery
$.ajax({
    url: '/api/upload',
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false
});
```

## Browser support

Tested on current Chrome and Firefox.

## API

#### ```captureVideoFrame(source, format, quality)```

#### Parameters

```source``` (element or string, mandatory) Source video. If string, id of the element.

```format``` (string, optional) Output image format. Can be either `png` or `jpeg`. `png` is the default.

```quality``` (number, optional) A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp. The default value is 0.92.

#### Return value

- Object with `blob`, `dataUri`, and `format` properties if the capture succeeded
- `false` if the capture failed.

Image blob can be easily uploaded to the server using XHR2 FormData API.

Image data URI can be easily set as `<img>` `src` attribute to show the captured image.

## License

  MIT
