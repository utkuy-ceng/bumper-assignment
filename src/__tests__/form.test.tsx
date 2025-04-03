import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import FormPage from "@/app/form/page";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock the fetch function
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
);

describe("Form Page Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();

    // Set up router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders without crashing", () => {
    render(<FormPage />);
    // Basic smoke test to ensure the component renders
    expect(document.body).toBeTruthy();
  });

  it("has register button", () => {
    render(<FormPage />);

    // Look for button
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(<FormPage />);

    // Submit the form
    await act(async () => {
      const registerButton = screen.getByRole("button", { name: /Register/i });
      fireEvent.click(registerButton);
    });

    // Verify fetch was not called (since validation would fail)
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
