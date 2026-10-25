export type ImageFormat = 'jpeg' | 'png' | 'webp';

export interface CapturedFrame {
  blob: Blob;
  dataUri: string;
  /** Format of the image. `png` if the browser can't encode the requested format. */
  format: ImageFormat;
}

export interface CapturedFrameBlob {
  blob: Blob;
  /** Format of the image. `png` if the browser can't encode the requested format. */
  format: ImageFormat;
}

const FORMATS: readonly string[] = ['jpeg', 'png', 'webp'];

function drawFrame(video: HTMLVideoElement | string, format: string): HTMLCanvasElement | null {
  const element = (typeof video === 'string' ? document.getElementById(video) : video) as HTMLVideoElement | null;

  if (!element || !FORMATS.includes(format)) {
    return null;
  }

  const { videoWidth, videoHeight } = element;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // The video has no frame to capture until its metadata has loaded.
  if (!context || videoWidth === 0 || videoHeight === 0) {
    return null;
  }

  canvas.width = videoWidth;
  canvas.height = videoHeight;
  context.drawImage(element, 0, 0);

  return canvas;
}

function formatOf(mimeType: string): ImageFormat {
  return mimeType.slice('image/'.length) as ImageFormat;
}

/**
 * Captures the current frame of a video element as an image.
 *
 * @param video Video element, or the id of one.
 * @param format Output image format. Defaults to `jpeg`.
 * @param quality Image quality between 0 and 1, used for `jpeg` and `webp`. Defaults to 0.92.
 * @returns The captured frame, or `false` if the capture failed.
 */
export function captureVideoFrame(
  video: HTMLVideoElement | string,
  format: ImageFormat = 'jpeg',
  quality = 0.92,
): CapturedFrame | false {
  const canvas = drawFrame(video, format);

  if (!canvas) {
    return false;
  }

  const dataUri = canvas.toDataURL(`image/${format}`, quality);
  const [header, data] = dataUri.split(',');
  const mimeType = header.slice('data:'.length).split(';')[0];

  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([arr], { type: mimeType });
  return { blob, dataUri, format: formatOf(mimeType) };
}

/**
 * Captures the current frame of a video element as an image blob without blocking on
 * image encoding. Use `URL.createObjectURL(blob)` to show the image.
 *
 * @param video Video element, or the id of one.
 * @param format Output image format. Defaults to `jpeg`.
 * @param quality Image quality between 0 and 1, used for `jpeg` and `webp`. Defaults to 0.92.
 * @returns The captured frame, or `false` if the capture failed.
 */
export function captureVideoFrameAsync(
  video: HTMLVideoElement | string,
  format: ImageFormat = 'jpeg',
  quality = 0.92,
): Promise<CapturedFrameBlob | false> {
  const canvas = drawFrame(video, format);

  if (!canvas) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ? { blob, format: formatOf(blob.type) } : false), `image/${format}`, quality);
  });
}

export default captureVideoFrame;
