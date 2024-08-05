import { exec } from "child_process";
import { readFile } from "fs/promises";
import { NFC } from "nfc-pcsc";
import { pbkdf2 } from "./crypto";

const nfc = new NFC();

let authenticatedWith: string | undefined;

// interface User {
//   hash: string;
//   authenticated: boolean;
// }
// const users = new Map<string, User>();

// async function loadUsers() {
//   const data = await readFile("users.csv", "utf8");
//   for (const line of data.split("\n")) {
//     const [uid, hash] = line.split(",");
//     users.set(uid, { hash, authenticated: false });
//   }
// }

nfc.on("reader", (reader) => {
  reader.on("card", async (card) => {
    try {
      if ((await pbkdf2(await reader.read(4, 64), "smartcard", 100000, 64, "sha512")).toString("hex") != (await readFile("secret.hash", "utf8")))
        return;
    } catch (error) {
      return;
    }

    console.debug("Authenticated with", card.uid);

    exec("loginctl unlock-session");

    authenticatedWith = card.uid;
  });

  reader.on("card.off", (card) => {
    console.debug("Card", card.uid, "removed");
    console.debug("Locking session due to card removal...");

    if (authenticatedWith === card.uid) {
      authenticatedWith = undefined;
      exec("loginctl lock-session");
    }
  });

  reader.on("end", () => {
    if (!authenticatedWith) return;

    console.debug("Locking session due to reader disconnection...");
    exec("loginctl lock-session");

    authenticatedWith = undefined;
  });
});

nfc.on("error", (err) => {
  console.debug("an error occurred", err);
});
