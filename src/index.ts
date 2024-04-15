import { imageLoader, Pixel, fullImageTransform, PixelMap, getPixel } from "./lib";
import { transformPipeline } from "./lib/ui";

const removeRed = (currentPixel: Pixel) => {
  return {
    ...currentPixel,
    color: {
      ...currentPixel.color,
      r: 0,
    },
  };
};

const make30FirstRowsBlack = (currentPixel: Pixel) => {
  if (currentPixel.position.y < 30) {
    return {
      ...currentPixel,
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      },
    };
  }
  return currentPixel;
};

const oneOutOfThreePixelRed = (currentPixel: Pixel) => {
  if ((currentPixel.position.x + currentPixel.position.y) % 3 === 0) {
    return {
      ...currentPixel,
      color: {
        r: 255,
        g: 0,
        b: 0,
        a: 255,
      },
    };
  }
  return currentPixel;
};

const flipHorizontal = (currentPixel: Pixel, pixelMap: PixelMap) => {
  return {
    ...currentPixel,
    color: getPixel(pixelMap)({
      x: currentPixel.position.x,
      y: pixelMap.height - 1 - currentPixel.position.y,
    }).color,
  };
};

const shuffle = <T>(array: Array<T>): Array<T> => {
  const newArray: Array<T> = [...array];
  return newArray.sort(() => Math.random() - Math.random());
};

try {
  const canvas = await imageLoader({
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtp7xAGpBbLmbG2trbsp-LxwOh-7lHpZogSYfCIwpmfxiuGBLG",
  });
  document.body.appendChild(canvas);
  transformPipeline(
    canvas,
    shuffle(
      [
        make30FirstRowsBlack,
        oneOutOfThreePixelRed,
        removeRed,
        flipHorizontal,
      ].map((transform) => fullImageTransform(transform))
    )
  );
} catch (error) {
  console.log(error);
}
