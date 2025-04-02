import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("Header Component", () => {
  it("renders correctly with default business tab active", () => {
    render(<Header />);

    // Check if business tab is active by default
    expect(screen.getByText("For business").parentElement).toHaveClass(
      "font-semibold"
    );
    expect(screen.getByText("For drivers").parentElement).not.toHaveClass(
      "font-semibold"
    );

    // Check if the orange section shows the correct text
    expect(screen.getByText("for business")).toBeInTheDocument();
  });

  it("switches tabs correctly when drivers tab is clicked", () => {
    render(<Header />);

    // Click on the drivers tab
    fireEvent.click(screen.getByText("For drivers"));

    // Check if drivers tab is now active
    expect(screen.getByText("For drivers").parentElement).toHaveClass(
      "font-semibold"
    );
    expect(screen.getByText("For business").parentElement).not.toHaveClass(
      "font-semibold"
    );

    // Check if the orange section shows the updated text
    expect(screen.getByText("for drivers")).toBeInTheDocument();
  });

  it("contains login and register links", () => {
    render(<Header />);

    // Check if the login link exists
    const loginLink = screen.getByText("Partner login").closest("a");
    expect(loginLink).toHaveAttribute("href", "/login");

    // Check if the register link exists
    const registerLink = screen.getByText("Register").closest("a");
    expect(registerLink).toHaveAttribute("href", "/form");
  });
});
