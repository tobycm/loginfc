import { exec } from "child_process";
import * as crypto from "crypto";
import { readFile } from "fs/promises";
import { NFC } from "nfc-pcsc";

const nfc = new NFC();

let authenticatedWith: string | undefined;

nfc.on("reader", (reader) => {
  reader.on("card", async (card) => {
    try {
      const hash = await new Promise(async (resolve, reject) => {
        crypto.pbkdf2(await reader.read(4, 64), "smartcard", 100000, 64, "sha512", (err, key) => {
          if (err) reject(err);
          resolve(key.toString("hex"));
        });
      });

      try {
        if (hash != (await readFile("secret.hash", "utf8"))) return;

        console.log("Authenticated with", card.uid);

        exec("loginctl show-session -p NCurrentInhibitors", (error, stdout) => {
          if (error) return console.error(error);

          if (!stdout.includes("NCurrentInhibitors=8")) return;

          exec("loginctl unlock-session");
        });

        authenticatedWith = card.uid;
      } catch (error) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  });

  reader.on("card.off", (card) => {
    console.log("Card", card.uid, "removed");
    console.log("Locking session...");

    if (authenticatedWith === card.uid) {
      authenticatedWith = undefined;
      exec("loginctl lock-session");
    }
  });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});
