import Auditable from '@/models/util/auditable';

export default interface Cast extends Auditable {
  id: number;
  name: string;
  birth: string;
  image: string;
}
