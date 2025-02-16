import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';

type AuthenticatedAccess = (args: AccessArgs<User>) => boolean;

export const authenticated: AuthenticatedAccess = ({ req }) => {
  return Boolean(req.user); // Handles null users correctly
};
