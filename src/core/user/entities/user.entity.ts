import { Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
