import React, { useState, useRef, useEffect } from "react";
import {
  useScrollDirection,
  UseScrollDirectionOptions,
} from "@n0n3br/use-scroll-direction";

function App() {
  const [options, setOptions] = useState<UseScrollDirectionOptions>({
    threshold: 0,
    throttleDelay: 100,
  });
  const [thresholdInput, setThresholdInput] = useState<string>(
    String(options.threshold)
  );
  const [delayInput, setDelayInput] = useState<string>(
    String(options.throttleDelay)
  );

  const windowScrollDirection = useScrollDirection(undefined, options);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const elementScrollDirection = useScrollDirection(elementRef, options);

  const handleOptionsChange = () => {
    const newThreshold = parseInt(thresholdInput, 10);
    const newDelay = parseInt(delayInput, 10);
    setOptions({
      threshold: isNaN(newThreshold) ? 0 : newThreshold,
      throttleDelay: isNaN(newDelay) ? 100 : newDelay,
    });
  };

  useEffect(() => {
    // Add some dummy content to make the page scrollable
    const body = document.body;
    if (body.scrollHeight <= window.innerHeight) {
      for (let i = 0; i < 5; i++) {
        const p = document.createElement("p");
        p.textContent =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".repeat(
            3
          );
        body.appendChild(p);
      }
    }
    if (
      elementRef.current &&
      elementRef.current.scrollHeight <= elementRef.current.clientHeight
    ) {
      const innerDiv = elementRef.current.querySelector("div");
      if (innerDiv) {
        for (let i = 0; i < 3; i++) {
          const p = document.createElement("p");
          p.textContent = "Element scrollable content. ".repeat(20);
          innerDiv.appendChild(p);
        }
      }
    }
  }, []);

  const getBackgroundColor = (direction: string) => {
    if (direction === "up") return "bg-green-200";
    if (direction === "down") return "bg-blue-200";
    return "bg-gray-200";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <header className="mb-8 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center bg-white">
        <h1 className="text-4xl font-bold text-gray-800">
          @n0n3br/use-scroll-direction
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          React hook to detect vertical scroll direction.
        </p>
      </header>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="threshold"
              className="block text-sm font-medium text-gray-700"
            >
              Threshold (px):
            </label>
            <input
              type="number"
              id="threshold"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="throttleDelay"
              className="block text-sm font-medium text-gray-700"
            >
              Throttle Delay (ms):
            </label>
            <input
              type="number"
              id="throttleDelay"
              value={delayInput}
              onChange={(e) => setDelayInput(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleOptionsChange}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Apply Options
        </button>
      </div>

      <div
        className={`w-full max-w-2xl p-6 rounded-lg shadow-lg mb-8 transition-colors duration-300 ${getBackgroundColor(
          windowScrollDirection
        )}`}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Window Scroll
        </h2>
        <p className="text-xl text-gray-800">
          Direction:{" "}
          <span className="font-bold">
            {windowScrollDirection.toUpperCase()}
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Scroll the entire page to see this change.
        </p>
      </div>

      <div
        className={`w-full max-w-2xl p-6 rounded-lg shadow-lg transition-colors duration-300 ${getBackgroundColor(
          elementScrollDirection
        )}`}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Element Scroll
        </h2>
        <div
          ref={elementRef}
          className="h-64 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50 mb-2"
        >
          <div className="h-[800px]">
            <p className="text-gray-700">
              This is a scrollable div. Try scrolling inside me!
            </p>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="py-2 text-gray-600">
                Scrollable content line {i + 1}
              </p>
            ))}
          </div>
        </div>
        <p className="text-xl text-gray-800">
          Direction:{" "}
          <span className="font-bold">
            {elementScrollDirection.toUpperCase()}
          </span>
        </p>
      </div>

      <footer className="mt-12 text-center text-gray-500">
        <p>
          Created by{" "}
          <a
            href="https://github.com/rogeriolaa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            rogeriolaa
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
