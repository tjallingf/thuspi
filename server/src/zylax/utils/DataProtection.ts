import * as crypto from 'crypto';

let globalServiceKey: string;
let globalEncryptionKey: string;

/** @deprecated */
export default class DataProtection {
    private static algorithm = 'aes-256-cbc';
    private static prefix = 'ENCRYPTED';

    /**
     * Setup the data encrypter.
     * @returns The service key, only when called for the first time.
     */
    static setup() {
        if(typeof globalServiceKey === 'undefined') {
            globalServiceKey = this.generateServiceKey();
            globalEncryptionKey = this.generateEncryptionKey();
            return globalServiceKey;
        }

        return null;
    }

    static encrypt(serviceKey: string, value: string): string {
        if(!this.verifyServiceKey(serviceKey)) return null;

        const iv = crypto.randomBytes(16);
        const key = Buffer.from(globalEncryptionKey);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(value);
        encrypted = Buffer.concat([ encrypted, cipher.final() ]);

        return this.prefix + '|' + iv.toString('hex') + '|' + encrypted.toString('hex');
    }

    static decrypt(serviceKey: string, encrypted: string): string {
        if(!this.verifyServiceKey(serviceKey)) return null;
        if(!encrypted.startsWith(this.prefix)) return null;

        let [ prefix, ivText, encryptedValue ] = encrypted.split('|');

        const iv = Buffer.from(ivText, 'hex');
        const key = Buffer.from(globalEncryptionKey);
        let encryptedText = Buffer.from(encryptedValue, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([ decrypted, decipher.final() ]);

        return decrypted.toString();
    }
    
    private static verifyServiceKey(serviceKey: string): boolean {
        const isValid = (typeof globalServiceKey === 'string' && serviceKey === globalServiceKey);
        
        if(!isValid)
            throw new Error('Invalid service key.');

        return isValid;
    }

    private static generateServiceKey(): string {
        return crypto.generateKeySync('hmac', { length: 64 }).export().toString('hex');
    }

    private static generateEncryptionKey(): string {
        return crypto.generateKeySync('hmac', { length: 128 }).export().toString('hex');
    }
}