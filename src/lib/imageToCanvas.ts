import { PixelMap } from "./imageManipulation";

const pixelMapToImageData = (pixelMap: PixelMap): ImageData => {
  const { height, map, width } = pixelMap;
  const array = new Uint8ClampedArray(height * width * 4);
  map.forEach((row, y) => {
    row.forEach((color, x) => {
      const colorIndex = y * width * 4 + x * 4;
      array[colorIndex] = color.r;
      array[colorIndex + 1] = color.g;
      array[colorIndex + 2] = color.b;
      array[colorIndex + 3] = color.a;
    });
  });
  return new ImageData(array, width, height);
}

export const flushToCanvas = (pixelMap: PixelMap, canvas: HTMLCanvasElement) => {
  const imageData = pixelMapToImageData(pixelMap);
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }
  context.putImageData(imageData, 0, 0);
}