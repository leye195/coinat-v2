export default class BrowserPort {
  private readonly weakRef: WeakRef<MessagePort>;

  constructor(port: MessagePort) {
    this.weakRef = new WeakRef(port);
    port.start();
  }

  isAlive(): boolean {
    return !!this.weakRef.deref();
  }

  postMessage(message: unknown): void {
    this.weakRef.deref()?.postMessage(message);
  }
  addEventListener(
    event: keyof MessagePortEventMap,
    handler: (event: MessageEvent<any>) => void,
  ): void {
    this.weakRef.deref()?.addEventListener(event, handler);
  }

  removeEventListener(
    event: keyof MessagePortEventMap,
    handler: (event: MessageEvent<any>) => void,
  ): void {
    this.weakRef.deref()?.removeEventListener(event, handler);
  }

  close(): void {
    this.weakRef.deref()?.close();
  }
}
