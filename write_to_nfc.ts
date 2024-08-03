import { readFile } from "fs/promises";
import { NFC } from "nfc-pcsc";

const nfc = new NFC();

console.log("Waiting for NFC reader...");

nfc.on("reader", (reader) => {
  console.log(`${reader.name} reader connected`);

  reader.on("card", async (card) => {
    console.log(`${card.uid} card detected`);

    console.log("Writing secret key to card...");

    try {
      const buffer = Buffer.alloc(64);
      buffer.write(await readFile("secret.key", "binary"));

      await reader.write(4, buffer);

      console.log("Secret key written to card");
      process.exit(0);
    } catch (error) {
      console.error(error);
    }
  });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});
