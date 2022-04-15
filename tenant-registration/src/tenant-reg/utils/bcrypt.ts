import * as bcrypt from 'bcryptjs';

const SALT = 10;

export function encodePassword(rawPassword: string){
    return bcrypt.hashSync(rawPassword, SALT);
}
