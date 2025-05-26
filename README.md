# React `useScrollDirection` Monorepo

This monorepo contains the `@n0n3br/use-scroll-direction` React hook and an example application demonstrating its usage.

## Packages

*   **`packages/use-scroll-direction`**: The core React hook for detecting vertical scroll direction.
*   **`apps/example`**: A Vite + React + Tailwind CSS application showcasing the hook's features.
*   **`configs/tsconfig`**: Shared TypeScript configurations.
*   **`configs/eslint-config-custom`**: Shared ESLint configuration.

## Development

This project uses [pnpm](https://pnpm.io/) as its package manager.

### Prerequisites

*   Node.js (LTS version recommended)
*   pnpm (version 8.6.0 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rogeriolaa/react-use-scroll-direction.git
    cd react-use-scroll-direction
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Available Scripts

*   `pnpm build`: Builds the `@n0n3br/use-scroll-direction` package.
*   `pnpm dev`: Starts the example application in development mode (usually on `http://localhost:3000`).
*   `pnpm lint`: Lints all packages.
*   `pnpm test`: Runs tests for the `@n0n3br/use-scroll-direction` package.
*   `pnpm test:watch`: Runs tests in watch mode for the `@n0n3br/use-scroll-direction` package.
*   `pnpm clean`: Removes `dist` and `node_modules` folders from all packages.
*   `pnpm typecheck`: Runs TypeScript type checking for all packages.

### Running the Example App

To run the example application:

```bash
pnpm dev
```

This will typically start the development server at `http://localhost:3000`.

### Building the Hook

To build the `@n0n3br/use-scroll-direction` package for publishing:

```bash
pnpm build
```

The output will be in the `packages/use-scroll-direction/dist` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./packages/use-scroll-direction/LICENSE) file in the hook's package for details.