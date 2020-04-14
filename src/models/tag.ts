import Auditable from '@/models/util/auditable';

export default interface Tag extends Auditable {
  id: number;
  name: string;
}
