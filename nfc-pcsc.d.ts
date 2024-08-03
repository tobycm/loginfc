declare module "nfc-pcsc" {
  export type ListenerSignature<L> = {
    [E in keyof L]: (...args: any[]) => any;
  };

  export type DefaultListener = {
    [k: string]: (...args: any[]) => any;
  };

  export class TypedEmitter<L extends ListenerSignature<L> = DefaultListener> {
    static defaultMaxListeners: number;
    addListener<U extends keyof L>(event: U, listener: L[U]): this;
    prependListener<U extends keyof L>(event: U, listener: L[U]): this;
    prependOnceListener<U extends keyof L>(event: U, listener: L[U]): this;
    removeListener<U extends keyof L>(event: U, listener: L[U]): this;
    removeAllListeners(event?: keyof L): this;
    once<U extends keyof L>(event: U, listener: L[U]): this;
    on<U extends keyof L>(event: U, listener: L[U]): this;
    off<U extends keyof L>(event: U, listener: L[U]): this;
    emit<U extends keyof L>(event: U, ...args: Parameters<L[U]>): boolean;
    eventNames<U extends keyof L>(): U[];
    listenerCount(type: keyof L): number;
    listeners<U extends keyof L>(type: U): L[U][];
    rawListeners<U extends keyof L>(type: U): L[U][];
    getMaxListeners(): number;
    setMaxListeners(n: number): this;
  }

  type Type = "TAG_ISO_14443_3" | "TAG_ISO_14443_4";

  const KEY_TYPE_A = 0x60;
  const KEY_TYPE_B = 0x61;

  interface Card {
    type: Type;
    standard: Type;
    uid?: string;
    data?: Buffer;
  }

  interface ReaderEmitter {
    card: (x: Card) => void;
    "card.off": (x: Card) => void;
    error: (x: Error) => void;
    end: () => void;
  }

  export class Reader extends TypedEmitter<ReaderEmitter> {
    get name(): string;

    authenticate(blockNumber: number, keyType: number, key: string, obsolete?: boolean): Promise<boolean>;

    read(blockNumber: number, length: number, blockSize?: number, packetSize?: number, readClass?: number): Promise<Buffer>;

    write(blockNumber: number, data: Buffer, blockSize?: number): Promise<void>;
  }

  interface NFCEmitter {
    reader: (reader: Reader) => void;
    error: (error: Error) => void;
  }

  export class NFC extends TypedEmitter<NFCEmitter> {}
}
