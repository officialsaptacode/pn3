export interface ICategory {
  id: number;
  name: string;
  description?: string;
  type?: string;
  parent_id?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
