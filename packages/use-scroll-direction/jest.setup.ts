import "@testing-library/jest-dom";

// Mocking requestAnimationFrame and cancelAnimationFrame for testing throttling
const rAFCallbacks = new Map<number, FrameRequestCallback>();
let lastId = 0;

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  const id = ++lastId;
  rAFCallbacks.set(id, callback);
  return id;
});

global.cancelAnimationFrame = jest.fn((id: number) => {
  rAFCallbacks.delete(id);
});

// Helper to run all pending requestAnimationFrame callbacks
export const runAllPendingrAFs = () => {
  const callbacksToRun = new Map(rAFCallbacks);
  rAFCallbacks.clear();
  callbacksToRun.forEach((cb) => cb(performance.now()));
};

// Mock performance.now() for consistent timing in tests
global.performance = {
  now: jest.fn(() => 0),
} as any;

// Mock setTimeout and clearTimeout to use Jest's fake timers
// This is important because requestAnimationFrame mock uses setTimeout internally
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

global.setTimeout = jest.fn(
  (cb: (...args: any[]) => void, ms?: number, ...args: any[]) => {
    return originalSetTimeout(cb, ms, ...args);
  }
) as any;

global.clearTimeout = jest.fn((id?: NodeJS.Timeout) => {
  originalClearTimeout(id);
}) as any;

// Mock window.scrollY and element.scrollTop
Object.defineProperty(window, "scrollY", {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLElement.prototype, "scrollTop", {
  writable: true,
  value: 0,
});

// Mock element.scrollHeight and element.clientHeight for element scroll tests
Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
  configurable: true,
  value: 2000,
});

Object.defineProperty(HTMLElement.prototype, "clientHeight", {
  configurable: true,
  value: 500,
});
