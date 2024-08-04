import * as crypto from "crypto";
import { writeFile } from "fs/promises";
import { pbkdf2 } from "./crypto";

// Generate a random key
const key = crypto.randomBytes(64);

// Write the key to a file
await writeFile("secret.key", key);

// Write the hash to a file
await writeFile("secret.hash", (await pbkdf2(key, "smartcard", 100000, 64, "sha512")).toString("hex"));
console.log("Hash written to secret.hash");

console.log();
console.log("Key and hash generated");
console.log("Please write the key to the card with write_key.ts");
