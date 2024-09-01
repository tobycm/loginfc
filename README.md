[![loginfc banner](/loginfc.png)](https://github.com/tobycm/loginfc)

# loginfc

Login with NFC tags xddd

Demo: https://www.youtube.com/watch?v=sH1NHUF4jtQ

## Installation

### Prerequisites

- NodeJS
- npm (or pnpm)
- NFC card reader/writer
- NFC card
- pcsc

### 1. Install dependencies

```sh {"id":"01J6NBCGD21GEH0ZM3FS70D7MN"}
npm install
```

or

```sh {"id":"01J6NBCGD3F5MJNPNHYJ4NWCVF"}
pnpm install
```

### 2. Generate a new key

```sh {"id":"01J6NBCGD3F5MJNPNHYJH4KSBH"}
npm run genkey
```

(or pnpm)

### 3. Write key to card

```sh {"id":"01J6NBCGD3F5MJNPNHYM6ARKFG"}
npm run writekey
```

Tap key to NFC card writer

Delete the key after successful write

### 4. Add key hash and username to `users.ts`

Add a new array element

Current:

```typescript {"id":"01J6NBFYCXEEHRKTCMTV6P1YQH"}
const users: Map<Hash, Username> = new Map([
  ["50ab5dd29f686c5ca8802bfd912f97f06992c0cd63a1bdec59ae7f244a81d9de29916af0552205cf2ede408fb014436ee003f876c186b581a25e381665637482", "toby"], //
]);
```

After:

```typescript {"id":"01J6NBH46XMR80CPCEPHJKWJCQ"}
const users: Map<Hash, Username> = new Map([
  ["50ab5dd29f686c5ca8802bfd912f97f06992c0cd63a1bdec59ae7f244a81d9de29916af0552205cf2ede408fb014436ee003f876c186b581a25e381665637482", "toby"], //
  ["your_hash_here", "your_username_here"],
]);
```

### 5. Start the listener

```sh {"id":"01J6NBCGD3F5MJNPNHYQ044DVH"}
npm run start
```

### 5. Enjoy :D
