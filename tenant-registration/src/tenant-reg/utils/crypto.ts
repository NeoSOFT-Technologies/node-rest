import * as crypto from 'crypto';

const algorithm = "aes-256-cbc";

// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32);


export function encodePassword(rawPassword: string){
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(rawPassword, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return  encryptedData;
}
