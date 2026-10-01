/**
 * Responsive attributes for the local, pre-optimized case-study screenshots.
 *
 * Convention (see public/case-studies/*): `name.webp` is the 738px-wide master and `name-360.webp` its
 * 360px sibling. Paths that don't follow it (API-provided images, logos, external URLs) are returned
 * as a plain `src`, so this is safe to spread on any <img>.
 *
 * `width`/`height` are the master's intrinsic size, which gives the browser the aspect ratio before
 * the file arrives (no layout shift); CSS still decides the rendered size.
 */
const SCREENSHOT = /^\/case-studies\/.+\.webp$/;

export function screenshotImage(src: string, sizes: string) {
  if (!SCREENSHOT.test(src) || src.endsWith("-360.webp")) return { src };
  return {
    src,
    srcSet: `${src.replace(/\.webp$/, "-360.webp")} 360w, ${src} 738w`,
    sizes,
    width: 738,
    height: 1599,
  };
}
