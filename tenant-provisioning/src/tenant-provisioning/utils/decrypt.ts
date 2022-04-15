import * as decrypt from 'crypto';

const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
const initVector = decrypt.randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = decrypt.randomBytes(32);

export function decodePassword(encryptedPassword: string){
    const decipher = decrypt.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(encryptedPassword, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}
