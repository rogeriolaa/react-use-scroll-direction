import React, { useState, useEffect, useRef, useCallback } from "react";

export type ScrollDirection = "up" | "down" | "static";

export interface UseScrollDirectionOptions {
  threshold?: number;
  throttleDelay?: number;
}

export function useScrollDirection(
  ref?: React.RefObject<HTMLElement | null>,
  options?: UseScrollDirectionOptions
): ScrollDirection {
  const { threshold = 0, throttleDelay = 100 } = options || {};

  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection>("static");
  const lastScrollPosition = useRef<number>(0);
  const throttleTimeoutId = useRef<number | null>(null);

  const getScrollY = useCallback(() => {
    if (ref && ref.current) {
      return ref.current.scrollTop;
    }
    return window.scrollY;
  }, [ref]);

  useEffect(() => {
    const targetElement = ref && ref.current ? ref.current : window;
    if (!targetElement) return;

    lastScrollPosition.current = getScrollY();

    const handleScroll = () => {
      const currentScrollPosition = getScrollY();
      const scrollDifference =
        currentScrollPosition - lastScrollPosition.current;

      if (Math.abs(scrollDifference) <= threshold) {
        // setScrollDirection('static'); // Or keep current direction if preferred
        return;
      }

      if (scrollDifference > 0) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollPosition.current = currentScrollPosition;
    };

    const throttledHandleScroll = () => {
      if (throttleTimeoutId.current === null) {
        throttleTimeoutId.current = window.requestAnimationFrame(() => {
          handleScroll();
          throttleTimeoutId.current = null;
        });
      }
    };

    // Fallback for throttleDelay if requestAnimationFrame is not desired or for specific timing
    const throttledHandleScrollWithDelay = () => {
      if (throttleTimeoutId.current === null) {
        throttleTimeoutId.current = window.setTimeout(() => {
          handleScroll();
          throttleTimeoutId.current = null;
        }, throttleDelay);
      }
    };

    const effectiveThrottledScrollHandler =
      throttleDelay > 0 && throttleDelay !== 100
        ? throttledHandleScrollWithDelay
        : throttledHandleScroll;
    // Defaulting to requestAnimationFrame if throttleDelay is 100 (default) or not specified for optimal performance.
    // If a specific throttleDelay is given (and not the default 100ms), use setTimeout.

    targetElement.addEventListener("scroll", effectiveThrottledScrollHandler, {
      passive: true,
    });

    return () => {
      targetElement.removeEventListener(
        "scroll",
        effectiveThrottledScrollHandler
      );
      if (throttleTimeoutId.current !== null) {
        if (throttleDelay > 0 && throttleDelay !== 100) {
          clearTimeout(throttleTimeoutId.current);
        } else {
          cancelAnimationFrame(throttleTimeoutId.current);
        }
        throttleTimeoutId.current = null;
      }
    };
  }, [ref, threshold, throttleDelay, getScrollY]);

  return scrollDirection;
}
