import { captureVideoFrame, captureVideoFrameAsync } from './index';

// The global is the function itself, as in 1.x, with the async variant attached.
const umd: typeof captureVideoFrame & { captureVideoFrameAsync: typeof captureVideoFrameAsync } = Object.assign(
  captureVideoFrame,
  { captureVideoFrameAsync },
);

export default umd;
