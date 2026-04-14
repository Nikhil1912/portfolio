export interface Photo {
  id: string;
  title: string;
  category: 'street' | 'landscape' | 'portrait' | 'architecture';
  width: number;
  height: number;
  src: string;
  alt: string;
  order: number;
}
