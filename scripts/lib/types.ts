export interface PhotoSrcSet {
  thumbnail: string;
  medium: string;
  large: string;
  full: string;
}

export interface PhotoManifestEntry {
  id: string;
  title: string;
  category: string;
  width: number;
  height: number;
  src: string;
  alt: string;
  order: number;
  placeholder: string;
  srcset: PhotoSrcSet;
}
