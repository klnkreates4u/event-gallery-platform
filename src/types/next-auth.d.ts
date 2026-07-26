import NextAuth from 'next-auth';
import { UserRole } from '@/types/enums';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      organizationId: string | null;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    organizationId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    organizationId: string | null;
  }
}
