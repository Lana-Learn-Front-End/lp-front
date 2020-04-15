import Auditable from '@/models/util/auditable';

export default interface FileMetadata extends Auditable {
  id: string;
}
