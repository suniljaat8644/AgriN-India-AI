/**
 * Utility to rasterize SVG Data URIs to real PNG Base64 Data URLs in the browser.
 * This ensures full compatibility with Gemini multimodal vision models.
 */
export function rasterizeSvgToPng(svgDataUrl?: string, width = 400, height = 400): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!svgDataUrl) {
      resolve(undefined);
      return;
    }

    // If it's already a raster image (JPEG / PNG / WebP), return directly
    if (svgDataUrl.startsWith('data:image/jpeg') || svgDataUrl.startsWith('data:image/png') || svgDataUrl.startsWith('data:image/webp')) {
      resolve(svgDataUrl);
      return;
    }

    if (typeof window === 'undefined' || !svgDataUrl.includes('image/svg')) {
      resolve(svgDataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl);
          return;
        }
      } catch (err) {
        console.warn('Canvas rasterization error:', err);
      }
      resolve(svgDataUrl);
    };

    img.onerror = (err) => {
      console.warn('Failed to load image for rasterization:', err);
      resolve(svgDataUrl);
    };

    img.src = svgDataUrl;
  });
}
