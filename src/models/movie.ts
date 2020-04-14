import Cast from '@/models/cast';
import Tag from '@/models/tag';
import Category from '@/models/category';
import Auditable from '@/models/util/auditable';

export default interface Movie extends Auditable {
  id: number;
  code: string;
  name: string;
  cover: string;
  casts: Cast[];
  tags: Tag[];
  categories: Category[];
}
