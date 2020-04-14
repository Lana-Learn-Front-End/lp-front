import Auditable from '@/models/util/auditable';

export default interface Category extends Auditable {
  id: number;
  name: string;
}
