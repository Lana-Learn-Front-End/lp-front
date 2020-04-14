import Auditable from '@/models/util/auditable';

export default interface File extends Auditable {
  id: string;
}
