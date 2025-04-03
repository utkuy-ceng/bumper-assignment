# Next.js Application

This is a modern web application built with Next.js, TypeScript, Tailwind CSS, and tested with Jest.

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- pnpm (v7 or newer)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

### Running the Development Server

```bash
pnpm dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Project Structure

- `src/app` - Next.js application pages and layouts
- `src/components` - Reusable UI components
- `src/styles` - Global styles and Tailwind configuration
- `src/lib` - Utility functions and helpers
- `src/constant` - Application constants and configurations
- `src/__tests__` - Test files for the application

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Fix ESLint issues and format code
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check if files are formatted correctly

## Testing

The application uses Jest and React Testing Library for testing. Tests are located in the `src/__tests__` directory.

### Running Tests

To run all tests:

```bash
pnpm test
```

To run tests in watch mode (useful during development):

```bash
pnpm test:watch
```

### Writing Tests

Test files should be placed in the `src/__tests__` directory and follow the naming convention `*.test.tsx`.

Example test file:

```tsx
import { render, screen } from "@testing-library/react";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

## Pages

The application includes the following pages:

- `/` - Home page
- `/form` - Form submission page
- `/list` - List view page

## Git Workflow

The project uses Husky for Git hooks to ensure code quality:

- Pre-commit: Lints and formats code
- Commit message: Uses conventional commit format

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities
