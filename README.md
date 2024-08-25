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

```
npm install
```

or

```
pnpm install
```

### 2. Generate a new key

```
npm run genkey
```

(or pnpm)

### 3. Write key to card

```
npm run writekey
```

Tap key to NFC card writer

Delete the key after successful write

### 4. Start the listener

```
npm run start
```

### 5. Enjoy :D
