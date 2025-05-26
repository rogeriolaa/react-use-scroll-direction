import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useScrollDirection,
  ScrollDirection,
  UseScrollDirectionOptions,
} from "./index";
import { runAllPendingrAFs } from "../jest.setup";

const fireScrollEvent = (target: Window | HTMLElement, scrollY: number) => {
  if (target === window) {
    (window as any).scrollY = scrollY;
  } else {
    (target as HTMLElement).scrollTop = scrollY;
  }
  target.dispatchEvent(new Event("scroll"));
};

describe("useScrollDirection", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  let mockRef: React.RefObject<HTMLDivElement | null>;
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    // Reset window scroll position
    (window as any).scrollY = 0;
    // Mock element for ref-based scrolling
    mockElement = document.createElement("div");
    // Set a default scrollHeight to allow scrolling
    Object.defineProperty(mockElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(mockElement, "clientHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(mockElement, "scrollTop", {
      configurable: true,
      value: 0,
      writable: true,
    });
    document.body.appendChild(mockElement);
    mockRef = { current: mockElement };
  });

  afterEach(() => {
    if (mockElement && mockElement.parentNode) {
      mockElement.parentNode.removeChild(mockElement);
    }
    jest.clearAllMocks();
  });

  it("initial direction should be static", () => {
    const { result } = renderHook(() => useScrollDirection());
    expect(result.current).toBe("static");
  });

  describe("window scroll", () => {
    it("should detect scroll down", async () => {
      const { result } = renderHook(() => useScrollDirection());
      act(() => {
        fireScrollEvent(window, 100);
      });
      await waitFor(() => expect(result.current).toBe("down"));
    });

    it("should detect scroll up", async () => {
      const { result } = renderHook(() => useScrollDirection());
      act(() => {
        fireScrollEvent(window, 100); // Scroll down first
      });
      await waitFor(() => expect(result.current).toBe("down"));
      act(() => {
        fireScrollEvent(window, 50); // Then scroll up
      });
      await waitFor(() => expect(result.current).toBe("up"));
    });

    it("should respect threshold for window scroll", async () => {
      const { result } = renderHook(() =>
        useScrollDirection(undefined, { threshold: 50 })
      );
      act(() => {
        fireScrollEvent(window, 40); // Less than threshold
      });
      await waitFor(() => expect(result.current).toBe("static")); // Or previous direction if not 'static' initially
      act(() => {
        fireScrollEvent(window, 100); // More than threshold
      });
      await waitFor(() => expect(result.current).toBe("down"));
    });
  });

  describe("element scroll", () => {
    it("should detect scroll down on element", async () => {
      const { result } = renderHook(() => useScrollDirection(mockRef));
      act(() => {
        fireScrollEvent(mockElement, 100);
      });
      await waitFor(() => expect(result.current).toBe("down"));
    });

    it("should detect scroll up on element", async () => {
      const { result } = renderHook(() => useScrollDirection(mockRef));
      act(() => {
        fireScrollEvent(mockElement, 100);
      });
      await waitFor(() => expect(result.current).toBe("down"));
      act(() => {
        fireScrollEvent(mockElement, 50);
      });
      await waitFor(() => expect(result.current).toBe("up"));
    });

    it("should respect threshold for element scroll", async () => {
      const { result } = renderHook(() =>
        useScrollDirection(mockRef, { threshold: 50 })
      );
      act(() => {
        fireScrollEvent(mockElement, 40);
      });
      await waitFor(() => expect(result.current).toBe("static"));
      act(() => {
        fireScrollEvent(mockElement, 100);
      });
      await waitFor(() => expect(result.current).toBe("down"));
    });
  });

  it("should cleanup event listeners on unmount", () => {
    const mockAddEventListener = jest.spyOn(window, "addEventListener");
    const mockRemoveEventListener = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useScrollDirection());
    expect(mockAddEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should cleanup event listeners on element unmount", () => {
    const mockAddEventListener = jest.spyOn(mockElement, "addEventListener");
    const mockRemoveEventListener = jest.spyOn(
      mockElement,
      "removeEventListener"
    );

    const { unmount } = renderHook(() => useScrollDirection(mockRef));
    expect(mockAddEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  describe("throttleDelay effectiveness", () => {
    it("should throttle scroll updates with requestAnimationFrame by default", async () => {
      const { result } = renderHook(
        () => useScrollDirection(undefined, { throttleDelay: 100 }) // Default uses rAF
      );

      act(() => {
        fireScrollEvent(window, 10);
        fireScrollEvent(window, 20);
        fireScrollEvent(window, 30);
      });
      act(() => {
        runAllPendingrAFs();
      });
      await waitFor(() => expect(result.current).toBe("down"));

      act(() => {
        fireScrollEvent(window, 20);
      });
      act(() => {
        runAllPendingrAFs();
      });
      await waitFor(() => expect(result.current).toBe("up"));
    });

    it("should throttle scroll updates with setTimeout", async () => {
      const { result } = renderHook(
        () =>
          useScrollDirection(undefined, {
            throttleDelay: 50,
          }) // Use a delay other than 100
      );

      act(() => {
        fireScrollEvent(window, 10);
        fireScrollEvent(window, 20);
        fireScrollEvent(window, 30);
      });
      act(() => {
        runAllPendingrAFs();
      });
      await waitFor(() => expect(result.current).toBe("down"));

      act(() => {
        fireScrollEvent(window, 20);
      });
      act(() => {
        runAllPendingrAFs();
      });
      await waitFor(() => expect(result.current).toBe("up"));
    });
  });
});
