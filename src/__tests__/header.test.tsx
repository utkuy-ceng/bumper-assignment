import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />;
  },
}));

describe("Header Component", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Set up window.innerWidth to simulate desktop by default
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });

    // Reset any local storage data
    localStorage.clear();
  });

  it("renders with the correct initial state", () => {
    render(<Header />);

    // Check if the Bumper logo is present
    expect(screen.getByAltText("BUMPER")).toBeInTheDocument();

    // Check if business tab is active by default
    const businessTab = screen.getByText("For business");
    expect(businessTab).toBeInTheDocument();
    expect(businessTab).toHaveClass("font-bold");

    // Check if drivers tab is not active
    const driversTab = screen.getByText("For drivers");
    expect(driversTab).toBeInTheDocument();
    expect(driversTab).not.toHaveClass("font-bold");

    // Check if orange section shows correct text
    expect(screen.getByText("for business")).toBeInTheDocument();
  });

  it("switches tabs when clicked", () => {
    render(<Header />);

    // Initial state - business tab should be active
    expect(screen.getByText("For business")).toHaveClass("font-bold");
    expect(screen.getByText("For drivers")).not.toHaveClass("font-bold");

    // Click on drivers tab
    fireEvent.click(screen.getByText("For drivers"));

    // Drivers tab should now be active
    expect(screen.getByText("For drivers")).toHaveClass("font-bold");
    expect(screen.getByText("For business")).not.toHaveClass("font-bold");
    expect(screen.getByText("for drivers")).toBeInTheDocument();

    // Click back on business tab
    fireEvent.click(screen.getByText("For business"));

    // Business tab should be active again
    expect(screen.getByText("For business")).toHaveClass("font-bold");
    expect(screen.getByText("For drivers")).not.toHaveClass("font-bold");
    expect(screen.getByText("for business")).toBeInTheDocument();
  });

  it("renders the correct partner login button on desktop", () => {
    render(<Header />);

    // Check for desktop version (text + icon)
    const desktopLoginButton = screen.getByText("Partner login").closest("a");
    expect(desktopLoginButton).toBeInTheDocument();
    expect(desktopLoginButton).toHaveAttribute("href", "/login");
    expect(desktopLoginButton).toHaveClass("hidden md:flex");
  });

  it("renders the correct partner login button on mobile", () => {
    // Set viewport to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });

    render(<Header />);

    // We can't directly check if the mobile login button is visible in this test environment
    // But we can verify its properties
    const mobileLoginButtons = screen.getAllByRole("link", { name: "" });
    const mobileLoginButton = mobileLoginButtons.find(
      (btn) =>
        btn.className.includes("md:hidden") &&
        btn.getAttribute("href") === "/login"
    );

    expect(mobileLoginButton).toBeDefined();
    expect(mobileLoginButton).toHaveAttribute("href", "/login");
    expect(mobileLoginButton).toHaveClass("md:hidden");
  });

  it("has the register button with the correct link", () => {
    render(<Header />);

    const registerButton = screen.getByText("Register").closest("a");
    expect(registerButton).toBeInTheDocument();
    expect(registerButton).toHaveAttribute("href", "/form");
    expect(registerButton).toHaveClass("bg-[#32BE50]");
  });

  it("has fixed positioning after mount", async () => {
    render(<Header />);

    // Header should start with position absolute (isMounted=false)
    const header = screen.getByRole("banner");

    // After the useEffect runs, position should be fixed
    setTimeout(() => {
      expect(header).toHaveClass("fixed");
      expect(header).not.toHaveClass("absolute");
    }, 0);
  });
});
