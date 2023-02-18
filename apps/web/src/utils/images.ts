const loadImages = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob<ImageMetadata>('@/assets/images/**/*.{jpg,jpeg,png}', {
      import: 'default',
    });
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images: Array<Record<string, () => Promise<unknown>>>;

/** */
export const fetchLocalImages = async () => {
  _images = _images || (await loadImages());
  return _images;
};

/** */
export const findImage = async (imagePath?: string) => {
  if (typeof imagePath !== 'string') {
    return null;
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (!imagePath.startsWith('@assets')) {
    return null;
  } // For now only consume images using ~/assets alias (or absolute)

  const images: Record<string, any> = await fetchLocalImages();
  const key = imagePath.replace('@', '/src/');

  return typeof images[key] === 'function' ? await images[key]() : null;
};
