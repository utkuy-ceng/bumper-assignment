import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormPage from "@/app/form/page";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe("FormPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the form correctly", () => {
    render(<FormPage />);

    // Check if important elements are rendered
    expect(screen.getByText("Join our network")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PayLater/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/PayNow/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Register/i })
    ).toBeInTheDocument();
  });

  it("validates required fields on blur", async () => {
    render(<FormPage />);

    // Trigger blur on empty name field
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.blur(nameInput);

    // Wait for validation to run
    await waitFor(() => {
      expect(screen.getByText(/Invalid name/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<FormPage />);

    // Enter invalid email
    const emailInput = screen.getByLabelText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    // Wait for validation to run
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });
  });

  it("validates mobile phone format", async () => {
    render(<FormPage />);

    // Enter invalid phone number
    const phoneInput = screen.getByLabelText(/Mobile phone number/i);
    fireEvent.change(phoneInput, { target: { value: "12345" } });
    fireEvent.blur(phoneInput);

    // Wait for validation to run
    await waitFor(() => {
      expect(
        screen.getByText(/Mobile phone must be in UK format/i)
      ).toBeInTheDocument();
    });
  });

  it("requires at least one service to be selected", async () => {
    render(<FormPage />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Test Company" },
    });
    fireEvent.change(screen.getByLabelText(/Mobile phone number/i), {
      target: { value: "07123456789" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Postcode/i), {
      target: { value: "EC1N 2TD" },
    });

    // Submit form without selecting services
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Wait for validation to run
    await waitFor(() => {
      expect(
        screen.getByText(/At least one service must be selected/i)
      ).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    render(<FormPage />);

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Test Company" },
    });
    fireEvent.change(screen.getByLabelText(/Mobile phone number/i), {
      target: { value: "07123456789" },
    });
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Postcode/i), {
      target: { value: "EC1N 2TD" },
    });

    // Select a service
    fireEvent.click(screen.getByLabelText(/PayLater/i));

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          company: "Test Company",
          mobile_phone: "07123456789",
          email_address: "test@example.com",
          postcode: "EC1N 2TD",
          pay_later: true,
          pay_now: false,
        }),
      });
    });
  });
});
