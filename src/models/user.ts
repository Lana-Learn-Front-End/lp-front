import Auditable from '@/models/util/auditable';

export default interface User extends Auditable {
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}
