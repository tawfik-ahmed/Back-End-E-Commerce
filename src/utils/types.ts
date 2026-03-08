import { UserRole } from './enums';

export type JwtPayloadType = {
  id: number;
  role?: UserRole;
};
