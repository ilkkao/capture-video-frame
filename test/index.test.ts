import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import captureVideoFrame, { captureVideoFrameAsync } from '../src/index';

// jsdom has no canvas backend, so encoding is stubbed. Unsupported formats fall back to PNG, as in browsers.
const PNG_BYTES = 'fake-png';

function createVideo(id = 'video', width = 640, height = 480): HTMLVideoElement {
  const video = document.createElement('video');
  video.id = id;
  Object.defineProperty(video, 'videoWidth', { value: width });
  Object.defineProperty(video, 'videoHeight', { value: height });
  document.body.append(video);
  return video;
}

let drawImage: ReturnType<typeof vi.fn>;
let supported: string[];

beforeEach(() => {
  drawImage = vi.fn();
  supported = ['image/png', 'image/jpeg', 'image/webp'];
  const mimeType = (type?: string) => (type && supported.includes(type) ? type : 'image/png');

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage } as never);
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(
    (type?: string) => `data:${mimeType(type)};base64,${btoa(PNG_BYTES)}`,
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback, type) =>
    callback(new Blob([PNG_BYTES], { type: mimeType(type) })),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});


describe('captureVideoFrame', () => {
  it('captures a JPEG by default', async () => {
    const video = createVideo();
    const frame = captureVideoFrame(video);

    expect(frame).not.toBe(false);
    if (!frame) return;
    expect(frame.format).toBe('jpeg');
    expect(frame.dataUri).toBe(`data:image/jpeg;base64,${btoa(PNG_BYTES)}`);
    expect(frame.blob.type).toBe('image/jpeg');
    expect(await frame.blob.text()).toBe(PNG_BYTES);
    expect(drawImage).toHaveBeenCalledWith(video, 0, 0);
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.92);
  });

  it('looks up the video by id', () => {
    createVideo('my-video');
    expect(captureVideoFrame('my-video', 'png')).toMatchObject({ format: 'png' });
  });

  it('passes quality, including 0', () => {
    captureVideoFrame(createVideo(), 'jpeg', 0);
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/jpeg', 0);
  });

  it('reports the format the browser actually produced', () => {
    supported = ['image/png', 'image/jpeg'];
    expect(captureVideoFrame(createVideo(), 'webp')).toMatchObject({ format: 'png' });
  });

  it('returns false for a missing video, unknown format or video without a frame', () => {
    expect(captureVideoFrame('missing')).toBe(false);
    expect(captureVideoFrame(createVideo(), 'gif' as never)).toBe(false);
    expect(captureVideoFrame(createVideo('empty', 0, 0))).toBe(false);
  });
});

describe('captureVideoFrameAsync', () => {
  it('captures a blob', async () => {
    const frame = await captureVideoFrameAsync(createVideo(), 'webp', 0.5);

    expect(frame).toMatchObject({ format: 'webp' });
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.5);
  });

  it('returns false when the capture fails', async () => {
    expect(await captureVideoFrameAsync('missing')).toBe(false);
  });
});
