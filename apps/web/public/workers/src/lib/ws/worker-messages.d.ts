/**
 * Message protocol between the main thread (ticker sources) and the bridge
 * workers (shared / dedicated). Both sides import these constants so the wire
 * format has a single source of truth — a typo can no longer silently break a
 * branch that compares against a string literal.
 */
export declare const WorkerMsg: {
    readonly Init: "init";
    readonly Ping: "ping";
    readonly Pong: "pong";
    readonly Disconnect: "disconnect";
    readonly Tickers: "tickers";
};
export type WorkerMsgType = (typeof WorkerMsg)[keyof typeof WorkerMsg];
//# sourceMappingURL=worker-messages.d.ts.map