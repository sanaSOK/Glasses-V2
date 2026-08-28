import { Role } from '../enums/role.enum';

export class ActiveUserData {
  userId: number;
  email: string;
  role: Role;
  storeId?: number | null;
}
