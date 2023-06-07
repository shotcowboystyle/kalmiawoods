import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class EncryptionService {
  /**
   * Hashes the provided string using the `Argon2id` algorithm recommended by
   * OWASP. See:
   * - https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
   * - https://security.stackexchange.com/questions/193351/in-2018-what-is-the-recommended-hash-to-store-passwords-bcrypt-scrypt-argon2
   *
   * @param data The data to encrypt
   * @example const hash = await this.encryptionService.hash(password);
   * @returns {Promise<string>} Hashed string.
   */
  async hash(data: string | Buffer): Promise<string> {
    return await argon2.hash(data, {
      // Options: https://github.com/ranisalt/node-argon2/wiki/Options
      type: argon2.argon2id,
      memoryCost: 4096, // KiB
      timeCost: 8, // iterations
      parallelism: 1, // threads
    });
  }

  /**
   * Verifies whether a `utf8` string matches the provided hash.
   *
   * @param hash The hash to verify against.
   * @param plain The string to verify.
   * @example const attempt = await this.encryptionService.verifyHash(user.password, password);
   * @returns {Promise<boolean>} True if the string and hash match.
   */
  async verifyHash(hash: string, plain: string): Promise<boolean> {
    return await argon2.verify(hash, plain);
  }
}
