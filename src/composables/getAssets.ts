interface ImageAsset {
  name: string;
  src: string;
  width: number;
  height: number;
  format: string;
}

export function getAssets(globs: any[]) {
  const assets: ImageAsset[] = [];
  globs.forEach((glob) => {
    assets.push({
      name: glob.default.src.split('/').pop().split('.').shift(),
      src: glob.default.src,
      width: glob.default.width,
      height: glob.default.height,
      format: glob.default.format,
    });
  });
  return assets;
}

// ugly hack to circumvent astro issue with dynamic import
// https://github.com/withastro/astro/issues/3373
// const images = import.meta.glob<ImageMetadata>('../images/*.{jpeg,jpg,png}', {
//   import: 'default',
// });
