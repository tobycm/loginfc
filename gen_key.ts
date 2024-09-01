import * as crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { pbkdf2 } from "./crypto";

// Generate a random key
const key = crypto.randomBytes(64);

// Write the key to a file
await writeFile("secret.key", key);

// Write the hash to a file
const hash = await pbkdf2(key, "smartcard", 100000, 64, "sha512");
await writeFile("secret.hash", hash.toString("hex"));
console.log("Hash:", hash.toString("hex"));

console.log();
console.log("Key and hash generated");
console.log("Please write the key to the card with write_key.ts");
