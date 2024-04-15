export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
}

type Position = {
  x: number;
  y: number;
}

export type Pixel = {
  color: Color;
  position: Position;
}

export type PixelMap = {
  height: number;
  map: Color[][];
  width: number;
};

export const colorToRgba = (color: Color) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

export const createPixelMap = (canvas: HTMLCanvasElement): PixelMap => {
  const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
  if (!imageData) {
    throw new Error('Unknown error when trying to create PixelMap');
  }
  let pixelMap: PixelMap['map'] = [[]];
  Array.from({ length: canvas.width * canvas.height }).forEach((_, pixelIndex) => {
    const colorIndex = pixelIndex * 4;
    const r = imageData.data[colorIndex];
    const g = imageData.data[colorIndex + 1];
    const b = imageData.data[colorIndex + 2];
    const a = imageData.data[colorIndex + 3];
    const x = pixelIndex % canvas.width;
    const y = Math.floor(pixelIndex / canvas.height);
    if (!pixelMap[y]) {
      pixelMap[y] = [];
    }
    pixelMap[y][x] = { r, g, b, a };
  });
  return {
    height: canvas.height,
    map: pixelMap,
    width: canvas.width,
  };
}

export const getPixel = (pixelMap: PixelMap) => (position: Position): Pixel => {
  return {
    color: pixelMap.map[position.y][position.x],
    position
  }
};

export const setPixel = (pixelMap: PixelMap) => (pixel: Pixel) => {
  pixelMap.map[pixel.position.y][pixel.position.x] = pixel.color;
}

export const transformPixels = (pixelMap: PixelMap, topLeftPosition: Position, bottomRightPosition: Position, transform: (input: Pixel, map: PixelMap) => Pixel): PixelMap => {
  if (topLeftPosition.x > bottomRightPosition.x) {
    throw new Error('TopLeftPosition must be closer to the left then bottomRightPosition');
  }
  if (topLeftPosition.y > bottomRightPosition.y) {
    throw new Error('TopLeftPosition must be closer to the top then bottomRightPosition');
  }
  const checkPixelOutOfBounds = (position: Position) => {
    if (position.x > pixelMap.width || position.x < 0) {
      return true;
    }
    if (position.y > pixelMap.height || position.y < 0) {
      return true;
    }
    return false;
  }
  if (checkPixelOutOfBounds(topLeftPosition)) {
    throw new Error('TopLeftPosition position out of bounds');
  }
  if (checkPixelOutOfBounds(bottomRightPosition)) {
    throw new Error('BottomRightPosition position out of bounds');
  }
  const newPixelMap = structuredClone(pixelMap);
  const boundGetPixel = getPixel(pixelMap);
  const boundSetPixel = setPixel(newPixelMap);
  for (let x = topLeftPosition.x; x < bottomRightPosition.x; x++) {
    for (let y = topLeftPosition.y; y < bottomRightPosition.y; y++) {
      boundSetPixel(transform(boundGetPixel({ x, y }), pixelMap));
    }
  }
  return newPixelMap;
 }

export const fullImageTransform = (transform: Parameters<(typeof transformPixels)>[3]) => (pixelMap: PixelMap): PixelMap => {
  return transformPixels(pixelMap, { x: 0, y: 0 }, { x: pixelMap.width, y: pixelMap.height }, transform);
}