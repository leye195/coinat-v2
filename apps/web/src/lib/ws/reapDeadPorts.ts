import type BrowserPort from '@/lib/browser-port';

/**
 * Keep only ports whose MessagePort is still reachable, closing and dropping the
 * rest. When a tab goes away its MessagePort eventually becomes unreachable and
 * the port's WeakRef deref()s to undefined (so `isAlive()` returns false).
 *
 * NOTE: this relies on the garbage collector having actually collected the port,
 * so cleanup timing is non-deterministic — a vanished tab can linger in the list
 * until the next GC happens to run.
 */
export function reapDeadPorts(ports: BrowserPort[]): BrowserPort[] {
  return ports.filter((port) => {
    if (port.isAlive()) return true;
    try {
      port.close();
    } catch {
      // ignore — already gone
    }
    return false;
  });
}
