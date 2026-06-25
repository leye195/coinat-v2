import type BrowserPort from '@/lib/browser-port';
import { reapDeadPorts } from '@/lib/ws/reapDeadPorts';

/** Mock with a togglable isAlive() (simulating WeakRef.deref() => undefined). */
class MockPort {
  constructor(private alive: boolean) {}
  isAlive() {
    return this.alive;
  }
  close = jest.fn();
}

const mk = (alive: boolean) => new MockPort(alive) as unknown as BrowserPort;

describe('reapDeadPorts', () => {
  it('keeps ports whose MessagePort is still reachable', () => {
    const a = mk(true);
    const b = mk(true);
    expect(reapDeadPorts([a, b])).toEqual([a, b]);
    expect(a.close).not.toHaveBeenCalled();
    expect(b.close).not.toHaveBeenCalled();
  });

  it("closes and drops ports whose MessagePort has been GC'd", () => {
    const live = mk(true);
    const dead = mk(false);

    const result = reapDeadPorts([live, dead]);

    expect(result).toEqual([live]);
    expect(dead.close).toHaveBeenCalled();
    expect(live.close).not.toHaveBeenCalled();
  });

  it('returns an empty array when every port is dead', () => {
    const dead = mk(false);
    expect(reapDeadPorts([dead])).toEqual([]);
    expect(dead.close).toHaveBeenCalled();
  });
});
