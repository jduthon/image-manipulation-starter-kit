import { createPixelMap, PixelMap } from './imageManipulation';
import { flushToCanvas } from './imageToCanvas';

export const createNewCanvas = (height: number, width: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  document.body.appendChild(canvas);
  return canvas;
}

export const transformPipeline = (originCanvas: HTMLCanvasElement, transforms: ((pixelMap: PixelMap) => PixelMap)[]) => {
  let currentPixelMap = createPixelMap(originCanvas);
  transforms.forEach(transform => {
    const nextPixelMap = transform(currentPixelMap);
    const newCanvas = createNewCanvas(nextPixelMap.height, nextPixelMap.width);
    flushToCanvas(nextPixelMap, newCanvas);
    currentPixelMap = nextPixelMap;
  });
}