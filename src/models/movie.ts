import Cast from '@/models/cast';
import Tag from '@/models/tag';

export default interface Movie {
  id: number;
  code: string;
  name: string;
  casts: Cast[];
  tags: Tag[];
}
