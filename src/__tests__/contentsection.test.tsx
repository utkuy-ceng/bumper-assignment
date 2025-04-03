import { render, screen } from "@testing-library/react";
import ContentSection from "@/components/home/contentsection";

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Fix boolean attributes by converting them to strings
    const imgProps = { ...props };
    if (typeof imgProps.fill === "boolean")
      imgProps.fill = imgProps.fill.toString();
    if (typeof imgProps.priority === "boolean")
      imgProps.priority = imgProps.priority.toString();

    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...imgProps}
        src={props.src}
        alt={props.alt}
        className={props.className || ""}
      />
    );
  },
}));

// Mock the next/link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("ContentSection Component", () => {
  beforeEach(() => {
    // Set up window.innerWidth to simulate different screen sizes
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200, // Default to desktop
    });

    // Reset any matchMedia mocks
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("renders the correct title and steps", () => {
    render(<ContentSection />);

    // Check for PAYLATER title
    expect(screen.getByText("PAYLATER")).toBeInTheDocument();

    // Check for Bumper logo
    expect(screen.getByAltText("Bumper")).toBeInTheDocument();

    // Check for steps
    expect(screen.getByText("FIX IT")).toBeInTheDocument();
    expect(screen.getByText("SPLIT IT")).toBeInTheDocument();
    expect(screen.getByText("SORTED")).toBeInTheDocument();

    // Check for the register button
    expect(screen.getByText("Register your interest")).toBeInTheDocument();
  });

  it("displays iPhone mockup in the right column on desktop", () => {
    // Set viewport to desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1200,
    });

    // Mock the match media to match lg breakpoint
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes("(min-width: 1024px)"),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ContentSection />);

    // Get all iPhone mockups and find the desktop one (it should be in a div with lg:flex)
    const iPhoneMockups = screen.getAllByAltText(
      "Bumper PayLater interface on a mobile phone"
    );
    expect(iPhoneMockups.length).toBeGreaterThan(0);

    // Find the container with the hidden lg:flex class
    const desktopContainer = document.querySelector(".hidden.lg\\:flex");
    expect(desktopContainer).toBeTruthy();
  });

  it("displays iPhone mockup after PAYLATER title on mobile", () => {
    // Set viewport to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 480,
    });

    // Mock the match media to NOT match any breakpoints
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<ContentSection />);

    // Find the mobile mockup container (with block lg:hidden class)
    const mobileMockupContainer = document.querySelector(".block.lg\\:hidden");
    expect(mobileMockupContainer).toBeTruthy();

    // Check if it has the expected mb-8 class for spacing
    expect(mobileMockupContainer).toHaveClass("mb-8");
  });

  it("has the correct responsive layout on desktop", () => {
    // Set viewport to desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1200,
    });

    // Mock the match media to match lg breakpoint
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query.includes("(min-width: 1024px)"),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(<ContentSection />);

    // Check if the main container has the flex-row class on desktop
    const flexContainer = container.querySelector(".flex-col.lg\\:flex-row");
    expect(flexContainer).toBeTruthy();

    // Check that the content side container has the correct width class
    // The first direct child of the flex container should be the content side
    // with the lg:w-1/2 class
    const contentSide = flexContainer?.firstElementChild;
    expect(contentSide).toHaveClass("lg:w-1/2");
  });
});
