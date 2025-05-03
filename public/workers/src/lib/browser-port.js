export default class BrowserPort {
    constructor(port) {
        this.weakRef = new WeakRef(port);
        port.start();
    }
    isAlive() {
        return !!this.weakRef.deref();
    }
    postMessage(message) {
        var _a;
        (_a = this.weakRef.deref()) === null || _a === void 0 ? void 0 : _a.postMessage(message);
    }
    addEventListener(event, handler) {
        var _a;
        (_a = this.weakRef.deref()) === null || _a === void 0 ? void 0 : _a.addEventListener(event, handler);
    }
    removeEventListener(event, handler) {
        var _a;
        (_a = this.weakRef.deref()) === null || _a === void 0 ? void 0 : _a.removeEventListener(event, handler);
    }
    close() {
        var _a;
        (_a = this.weakRef.deref()) === null || _a === void 0 ? void 0 : _a.close();
    }
}
