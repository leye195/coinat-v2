/**
 * Message protocol between the main thread (ticker sources) and the bridge
 * workers (shared / dedicated). Both sides import these constants so the wire
 * format has a single source of truth — a typo can no longer silently break a
 * branch that compares against a string literal.
 */
export const WorkerMsg = {
  Init: 'init',
  Ping: 'ping',
  Pong: 'pong',
  Disconnect: 'disconnect',
  Tickers: 'tickers',
} as const;

export type WorkerMsgType = (typeof WorkerMsg)[keyof typeof WorkerMsg];
