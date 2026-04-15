export interface Photo {
  id: string;
  title: string;
  category: 'street' | 'landscape' | 'portrait' | 'architecture';
  /** Width of the "large" (1600px) variant in pixels */
  width: number;
  /** Height of the "large" (1600px) variant in pixels */
  height: number;
  /** Relative URL of the large (1600px) variant — used as the primary src */
  src: string;
  alt: string;
  order: number;
  /** Base64-encoded data URI of the 20px blur placeholder */
  placeholder: string;
  /** Relative URLs for each processed size */
  srcset: PhotoSrcSet;
}

export interface PhotoSrcSet {
  thumbnail: string; // 400px wide
  medium: string; // 800px wide
  large: string; // 1600px wide
  full: string; // 2400px wide
}
