import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { NFC } from "nfc-pcsc";

const nfc = new NFC();

nfc.on("reader", (reader) => {
  // console.log(`${reader.name} device attached`);

  reader.on("card", async (card) => {
    // console.log(`${reader.name} card detected`, card);

    try {
      const hash = createHash("sha512")
        .update(await reader.read(4, 16))
        .digest("hex");

      try {
        console.log(hash, await readFile("secret.hash", "utf8"));
        if (hash != (await readFile("secret.hash", "utf8"))) return;

        console.log("Access granted");
      } catch (error) {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  });

  // reader.on("card.off", (card) => {
  //   console.log(`${reader.name} card removed`, card);
  // });

  // reader.on("error", (err) => {
  //   console.log(`${reader.name} an error occurred`, err);
  // });

  // reader.on("end", () => {
  //   console.log(`${reader.name} device removed`);
  // });
});

nfc.on("error", (err) => {
  console.log("an error occurred", err);
});
