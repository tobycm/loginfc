import { exec } from "child_process";
import { NFC } from "nfc-pcsc";
import { pbkdf2 } from "./crypto";
import users from "./users";

const nfc = new NFC();

type CardUID = string;
type Username = string;

const authenticated: Map<CardUID, Username> = new Map();

nfc.on("reader", (reader) => {
  reader.on("card", async (card) => {
    let hash: string;
    try {
      hash = (await pbkdf2(await reader.read(4, 64), "smartcard", 100000, 64, "sha512")).toString("hex");
    } catch (error) {
      return;
    }

    const user = users.get(hash);
    if (!user) return;

    console.debug("Authenticated with", card.uid, "as", user);

    exec(`sudo runuser -u ${user} loginctl unlock-session`);

    if (card.uid) authenticated.set(card.uid, user);
  });

  reader.on("card.off", (card) => {
    console.debug("Card", card.uid, "removed");

    if (!card.uid) return console.debug("Card UID not found");
    const user = authenticated.get(card.uid);
    if (!user) return console.debug("User not found");

    exec(`sudo runuser -u ${user} loginctl lock-session`);

    console.debug(`Locking session for ${user} due to card removal...`);
  });

  reader.on("end", () => {
    if (authenticated.size === 0) return;

    console.debug("Locking session due to reader disconnection...");
    for (const [, user] of authenticated) {
      exec(`sudo runuser -u ${user} loginctl lock-session`);
      console.debug(`Locked session for ${user}`);
    }

    authenticated.clear();
  });
});

nfc.on("error", (err) => {
  console.debug("an error occurred", err);
});
