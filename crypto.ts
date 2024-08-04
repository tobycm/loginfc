import * as crypto from "crypto";

export const pbkdf2 = (password: crypto.BinaryLike, salt: crypto.BinaryLike, iterations: number, keylen: number, digest: string): Promise<Buffer> =>
  new Promise((resolve, reject) => crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => (err ? reject(err) : resolve(key))));
