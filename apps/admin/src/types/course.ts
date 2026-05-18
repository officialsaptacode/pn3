export interface ICourse {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  categoryId: number;
  bannerImage?: string;
  thumbImage?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
