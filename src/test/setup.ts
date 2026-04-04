import "@testing-library/jest-dom";
import { vi } from "vitest";

// Jest compatibility globals
// Many existing tests use jest.fn() / jest.mock() — map them to vitest equivalents
(globalThis as any).jest = {
  fn: vi.fn,
  mock: vi.mock,
  spyOn: vi.spyOn,
  requireActual: vi.importActual,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock chrome extension APIs
(globalThis as any).chrome = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: { addListener: vi.fn(), removeListener: vi.fn() },
    getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
  },
  storage: {
    local: {
      get: vi.fn((_keys: any, callback: any) => callback({})),
      set: vi.fn((_items: any, callback?: any) => callback?.()),
    },
    sync: {
      get: vi.fn((_keys: any, callback: any) => callback({})),
      set: vi.fn((_items: any, callback?: any) => callback?.()),
    },
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
};
