import { hashSync } from 'bcryptjs';

const SALT = 10;

export function encodePassword(rawPassword: string) {
  return hashSync(rawPassword, SALT);
}
