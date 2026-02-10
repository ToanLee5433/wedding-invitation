/**
 * Image Optimization Utilities
 * Tối ưu hình ảnh cho mạng yếu và máy yếu
 */

/**
 * Tự động resize và optimize Unsplash images
 * @param url - URL ảnh gốc
 * @param width - Chiều rộng mong muốn (mặc định 800px)
 * @param quality - Chất lượng (1-100, mặc định 75)
 */
export function optimizeUnsplashImage(url: string, width: number = 800, quality: number = 75): string {
  if (!url.includes('unsplash.com')) return url;
  
  // Remove existing parameters
  const baseUrl = url.split('?')[0];
  
  // Add optimized parameters
  return `${baseUrl}?auto=format&fit=crop&q=${quality}&w=${width}`;
}

/**
 * Tạo srcset cho responsive images
 * @param url - URL ảnh gốc
 */
export function generateImageSrcSet(url: string): string {
  if (!url.includes('unsplash.com')) return '';
  
  const sizes = [400, 800, 1200, 1600];
  return sizes
    .map(size => `${optimizeUnsplashImage(url, size, 75)} ${size}w`)
    .join(', ');
}

/**
 * Lazy load images with intersection observer
 * @param imgElement - HTML Image element
 */
export function lazyLoadImage(imgElement: HTMLImageElement): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(imgElement);
  } else {
    // Fallback for older browsers
    const src = imgElement.dataset.src;
    if (src) imgElement.src = src;
  }
}

/**
 * Preload critical images
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    })
  );
}

/**
 * Detect if user is on slow connection
 */
export function isSlowConnection(): boolean {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    return conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.saveData;
  }
  return false;
}

/**
 * Get optimal image quality based on connection
 */
export function getOptimalQuality(): number {
  return isSlowConnection() ? 60 : 75;
}
