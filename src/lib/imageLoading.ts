export const imageLoader = async ({ url }: { url: string }) => {
  const img = new Image();
  let imgLoadingSuccess = (canvas: HTMLCanvasElement) => {};
  let imgLoadingFailure = () => {};
  const imgLoadingPromise = new Promise<HTMLCanvasElement>((resolve, reject) => {
    imgLoadingSuccess = resolve;
    imgLoadingFailure = reject;
  });
  img.crossOrigin = "Anonymous";
  img.src = url;
  img.addEventListener("load", () => {
    const canvas = document.createElement('canvas');
    canvas.height = img.height;
    canvas.width = img.width;
    canvas.getContext('2d')?.drawImage(img, 0, 0);
    imgLoadingSuccess(canvas);
  });
  img.addEventListener("error", () => {
    imgLoadingFailure();
  });
  return imgLoadingPromise;
}
