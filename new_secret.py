#!/usr/bin/env python3

from hashlib import pbkdf2_hmac
from secrets import token_bytes

key = token_bytes(64)

with open("secret.key", "wb") as key_file:
    key_file.write(key)
    print("Delete secret.key after written to card")

hash = pbkdf2_hmac("sha512", key, b"smartcard",
                   100000)  # dont really want a salt tbh

with open("secret.hash", "wb") as hash_file:
    hash_file.write(hash)
    print("Hash written to secret.hash")

print()
print("Key and hash generated")
print("Please write the key to the card with write_to_nfc.py")
