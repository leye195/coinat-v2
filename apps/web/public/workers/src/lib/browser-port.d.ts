export default class BrowserPort {
    private readonly weakRef;
    constructor(port: MessagePort);
    isAlive(): boolean;
    postMessage(message: unknown): void;
    addEventListener(event: keyof MessagePortEventMap, handler: (event: MessageEvent<any>) => void): void;
    removeEventListener(event: keyof MessagePortEventMap, handler: (event: MessageEvent<any>) => void): void;
    close(): void;
}
//# sourceMappingURL=browser-port.d.ts.map