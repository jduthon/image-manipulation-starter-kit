import { PixelMap, createPixelMap, flushToCanvas } from ".";

const drawVidToCanvas = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
  const drawFn = () => {
    canvas.getContext('2d')?.drawImage(video, 0, 0);
  }
  let rafId: ReturnType<typeof requestAnimationFrame>;
  const loop = () => {
   drawFn();
   rafId = requestAnimationFrame(loop); 
  }
  loop();
  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  }
}

const drawTransformsToCanvas = (video: HTMLVideoElement, transforms: ((pixelMap: PixelMap) => PixelMap)[]) => {
  const imageBufferCanvas = document.createElement('canvas');
  imageBufferCanvas.height = video.height;
  imageBufferCanvas.width = video.width;
  const displayedCanvas = document.createElement('canvas');
  displayedCanvas.height = video.height;
  displayedCanvas.width = video.width;
  document.body.appendChild(displayedCanvas);
  const drawFn = () => {
    imageBufferCanvas.getContext('2d')?.drawImage(video, 0, 0);
    let pixelMap = createPixelMap(imageBufferCanvas);
    transforms.forEach((transform) => {
      pixelMap = transform(pixelMap);
    });
    flushToCanvas(pixelMap, displayedCanvas);
  }
  let rafId: ReturnType<typeof requestAnimationFrame>;
  const loop = () => {
   drawFn();
   rafId = requestAnimationFrame(loop); 
  }
  loop();
  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  }
}

const surprise = async (transforms: ((pixelMap: PixelMap) => PixelMap)[]) => {
  const stream = await navigator.mediaDevices.getUserMedia({video: true});
  const {width, height} = stream.getTracks()[0].getSettings();
  const videoElement = document.createElement('video');
  console.log(stream);
  videoElement.srcObject = stream;
  videoElement.height = height!;
  videoElement.width = width!;
  const canvas = document.createElement('canvas');
  canvas.height = height!;
  canvas.width = width!;
  videoElement.onloadedmetadata = () => {
    videoElement.play();
    drawTransformsToCanvas(videoElement, transforms);
    // drawVidToCanvas(videoElement, canvas);
  };
  document.body.appendChild(canvas);
  
  /*
  videoElement.height = height;
  videoElement.width = width;
  */
}

export { surprise };