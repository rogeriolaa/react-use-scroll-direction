# @n0n3br/react-use-scroll-direction

[![npm version](https://badge.fury.io/js/%40n0n3br%2Fuse-scroll-direction.svg)](https://badge.fury.io/js/%40n0n3br%2Fuse-scroll-direction)

A robust React hook to detect vertical scroll direction (`'up'`, `'down'`, `'static'`) for any DOM element or the `window`.

## Installation

Using pnpm:

```bash
pnpm add @n0n3br/react-use-scroll-direction
```

Using npm:

```bash
npm install @n0n3br/react-use-scroll-direction
```

Using yarn:

```bash
yarn add @n0n3br/react-use-scroll-direction
```

## Usage

### Basic Window Scroll

```tsx
import React from "react";
import { useScrollDirection } from "@n0n3br/react-use-scroll-direction";

const App = () => {
  const scrollDirection = useScrollDirection();

  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <p>Scroll direction: {scrollDirection}</p>
      <p>Scroll down or up to see the direction change.</p>
    </div>
  );
};

export default App;
```

### Element Specific Scroll

```tsx
import React, { useRef } from "react";
import { useScrollDirection } from "@n0n3br/react-use-scroll-direction";

const App = () => {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const scrollDirection = useScrollDirection(scrollableRef);

  return (
    <div style={{ padding: "20px" }}>
      <p>Scroll direction for the div: {scrollDirection}</p>
      <div
        ref={scrollableRef}
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid black",
        }}
      >
        <div style={{ height: "600px", padding: "10px" }}>
          <p>Scrollable content inside the div.</p>
          <p>Scroll me!</p>
        </div>
      </div>
    </div>
  );
};

export default App;
```

### With Options

```tsx
import React, { useRef } from "react";
import { useScrollDirection } from "@n0n3br/react-use-scroll-direction";

const App = () => {
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const scrollDirection = useScrollDirection(scrollableRef, {
    threshold: 30, // Pixels to scroll before direction changes
    throttleDelay: 150, // Milliseconds to throttle scroll events (uses setTimeout if > 0 and not 100, otherwise requestAnimationFrame)
  });

  // ... rest of your component
  return (
    <div>
      {/* Your component JSX using scrollDirection */}
      <p>Scroll direction: {scrollDirection}</p>
    </div>
  );
};

export default App;
```

## API

### `useScrollDirection(ref?, options?)`

#### Parameters:

- `ref` (optional): `React.RefObject<HTMLElement | null>`
  - A React ref object pointing to the DOM element for which to track scroll direction.
  - If not provided, the hook defaults to tracking the `window` scroll.
- `options` (optional): `UseScrollDirectionOptions`
  - An object to configure the hook's behavior.
  - `threshold` (optional): `number`
    - The minimum number of pixels the user must scroll before the direction is updated.
    - **Default:** `0`
  - `throttleDelay` (optional): `number`
    - The delay in milliseconds to throttle scroll event handling.
    - Uses `requestAnimationFrame` for optimal performance by default (when `throttleDelay` is `100` or not specified).
    - If a `throttleDelay` other than `100` (and greater than `0`) is provided, `setTimeout` will be used for throttling with that specific delay.
    - Set to `0` to disable throttling (not recommended for performance-sensitive applications).
    - **Default:** `100` (uses `requestAnimationFrame`)

#### Return Value:

- `ScrollDirection`: `'up' | 'down' | 'static'`
  - The current detected vertical scroll direction.

#### Types:

```typescript
export type ScrollDirection = "up" | "down" | "static";

export interface UseScrollDirectionOptions {
  threshold?: number;
  throttleDelay?: number;
}
```

## Live Example

[Link to Live Example App](#) (To be added once the example app is deployed)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/rogeriolaa/react-use-scroll-direction).

## License

[MIT](./LICENSE)
