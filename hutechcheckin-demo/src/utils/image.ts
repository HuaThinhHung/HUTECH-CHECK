export const getImageDimensionsFromUrl = async (url: string) => {
  const promise = new Promise<{ width: number; height: number }>(
    (resole: any, reject: any) => {
      const image = new Image();
      image.src = url;

      image.onload = function () {
        const width = image.width;
        const height = image.height;

        resole({ width, height });
      };

      image.onerror = reject;
    }
  );

  return promise;
};

export const getClassImageType = async (imageUrl: string) => {
  const imageType = new ImageUrlUtils();
  if (await imageType.isSquare(imageUrl)) {
    return "image-square";
  } else if (await imageType.isLandscape(imageUrl)) {
    return "image-landscape";
  } else if (await imageType.isPortrait(imageUrl)) {
    return "image-portrait";
  } else {
    return "";
  }
};

export class ImageUrlUtils {
  async isSquare(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url);
    return width === height;
  }

  async isLandscape(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url);
    return width > height;
  }

  async isPortrait(url: string): Promise<boolean> {
    const { width, height } = await getImageDimensionsFromUrl(url);
    return width < height;
  }
}
