# capture-video-frame

A micro-library for taking screenshots from a running HTML5 video. Built to work together with [getUserMedia.js](https://github.com/addyosmani/getUserMedia.js/)

## Installation

    $ npm install --save capture-video-frame

or

    $ bower install --save capture-video-frame

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

var img = document.getElementById('my-screenshot');
img.setAttribute('src', frame.dataUri);
```

## Browser support

Tested on current Chrome and Firefox.

## API

```captureVideoFrame(source, format)```

### Options

```source``` (element or string, mandatory) Source video. If string, id of the element.

```format``` (string, optional) Output image format. Can be either `png` or `jpeg`. `png` is the default.

### Return value

- Object with `blob`, `dataUri`, and `format` properties if the capture succeeded
- `false` if the capture failed.

Image blob can be easily uploaded to the server using XHR2 FormData API.

Image data URI can be easily set as `<img>` `src` attribute to show the captured image.

## License

  MIT
