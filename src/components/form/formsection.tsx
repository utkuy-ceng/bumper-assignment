"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faMobileAlt,
  faEnvelope,
  faMapMarkerAlt,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

// Form validation schema
const baseFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .regex(
      /^[a-zA-Z0-9\s]*$/,
      "Name must contain only alphanumeric characters"
    ),
  company: z
    .string()
    .min(1, "Company is required")
    .max(255, "Company must be less than 255 characters"),
  mobile_phone: z
    .string()
    .min(1, "Mobile phone is required")
    .refine((val) => /^0(\s*)7/.test(val), "Mobile number must start with 07")
    .refine((val) => {
      // Remove all spaces to count digits
      const digitsOnly = val.replace(/\s+/g, "");
      return digitsOnly.length === 11;
    }, "Mobile number must be 11 digits in total")
    .refine(
      (val) => /^0(\s*)(7)(\s*)(\d(\s*)){9}$/.test(val),
      "Please enter a valid UK mobile number"
    ),
  email_address: z
    .string()
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be less than 255 characters")
    .email("Please enter a valid email address"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .max(30, "Postcode must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9\s]*$/,
      "Postcode must contain only alphanumeric characters"
    ),
  pay_later: z.boolean(),
  pay_now: z.boolean(),
});

const formSchema = baseFormSchema.refine(
  (data) => data.pay_later || data.pay_now,
  {
    message: "You must select at least one service",
    path: ["services"],
  }
);

// TypeScript type for form data
type FormData = z.infer<typeof baseFormSchema>;

export default function FormSection() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    mobile_phone: "",
    email_address: "",
    postcode: "",
    pay_later: false,
    pay_now: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [showPostcodeSuggestions, setShowPostcodeSuggestions] = useState(false);
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Mock function to generate postcode suggestions
  const getPostcodeSuggestions = (input: string) => {
    if (!input || input.length < 2) return [];

    // Sample postcodes for demo
    const allPostcodes = [
      "N6 1BA",
      "N6 2CD",
      "N6 3EF",
      "N6 4GH",
      "N6 5IJ",
      "W1 1AA",
      "SW1 1BB",
      "E1 6CD",
    ];

    // Only return postcodes that start with the user's input (case insensitive)
    const inputLower = input.toLowerCase();
    return allPostcodes.filter((postcode) =>
      postcode.toLowerCase().startsWith(inputLower)
    );
  };

  // Helper function to highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    // Since we're only showing matches from the beginning,
    // we can highlight just the first part that matches the query length
    const matchLength = query.length;

    return (
      <>
        <strong>{text.substring(0, matchLength)}</strong>
        {text.substring(matchLength)}
      </>
    );
  };

  const validateField = (name: keyof FormData, value: string | boolean) => {
    try {
      baseFormSchema.shape[name].parse(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      // Mark field as valid if it's a non-empty string or a checkbox that's checked
      if (
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean" && value === true)
      ) {
        setValidFields((prev) => ({
          ...prev,
          [name]: true,
        }));
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
        setValidFields((prev) => {
          const newValid = { ...prev };
          delete newValid[name];
          return newValid;
        });
      }
      return false;
    }
  };

  const validateServicesFields = () => {
    try {
      formSchema
        .refine((data) => data.pay_later || data.pay_now, {
          message: "You must select at least one service",
          path: ["services"],
        })
        .parse(formData);

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const serviceError = error.errors.find((e) =>
          e.path.includes("services")
        );
        if (serviceError) {
          setErrors((prev) => ({
            ...prev,
            services: serviceError.message,
          }));
        }
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    // Handle postcode suggestions
    if (name === "postcode" && typeof inputValue === "string") {
      const suggestions = getPostcodeSuggestions(inputValue);
      setPostcodeSuggestions(suggestions);
      setShowPostcodeSuggestions(suggestions.length > 0);
    }

    // Validate on change for text inputs
    if (type !== "checkbox") {
      validateField(name as keyof FormData, value);
    } else if (name === "pay_later" || name === "pay_now") {
      setTimeout(() => {
        validateServicesFields();
      }, 0);
    }
  };

  const handleSelectPostcode = (postcode: string) => {
    setFormData((prev) => ({
      ...prev,
      postcode,
    }));
    setShowPostcodeSuggestions(false);
    validateField("postcode", postcode);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.name);

    // Show postcode suggestions if needed
    if (e.target.name === "postcode" && e.target.value.length >= 2) {
      setShowPostcodeSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFocusedField(null);

    // Don't hide suggestions immediately to allow clicks
    if (name === "postcode") {
      setTimeout(() => {
        setShowPostcodeSuggestions(false);
      }, 200);
    }

    validateField(name as keyof FormData, inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    // Validate all fields
    let isValid = true;

    // Validate text fields
    for (const [name, value] of Object.entries(formData)) {
      if (name !== "pay_later" && name !== "pay_now") {
        if (typeof value === "string" && value.trim() === "") {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name
              .replace("_", " ")
              .replace(/^\w/, (c) => c.toUpperCase())} is required`,
          }));
          isValid = false;
        } else {
          isValid =
            validateField(name as keyof FormData, value as string) && isValid;
        }
      }
    }

    // Validate service fields
    isValid = validateServicesFields() && isValid;

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Save form data to localStorage
      const existingData = localStorage.getItem("registeredDealerships");
      const dealerships = existingData ? JSON.parse(existingData) : [];

      // Add a unique ID and creation date
      const newDealership = {
        ...formData,
        id: `dealer-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      dealerships.push(newDealership);
      localStorage.setItem(
        "registeredDealerships",
        JSON.stringify(dealerships)
      );

      // Optional: Also submit to API if it exists
      try {
        const response = await fetch("/api/partners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          console.warn("API submission failed but local storage succeeded");
        }
      } catch (apiError) {
        console.warn("API error but continuing with local storage", apiError);
      }

      // Redirect to the list page
      router.push("/list");
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-bg py-8 md:py-16 min-h-[calc(100vh-72px)]">
      <div
        className="w-full md:w-[60%] min-w-[320px] mx-auto px-4 mt-24 md:mt-4"
        style={{ maxWidth: "none" }}
      >
        {/* Header placeholder to push content down - only visible on desktop */}
        <div className="hidden md:block h-[100px] w-full" />

        {/* Back button - desktop version */}
        <div className="hidden md:flex items-center mb-8">
          <Link
            href="/"
            className="text-white hover:text-white/80 flex items-center transition-colors p-2 rounded-full"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>

        {/* Back button - mobile version */}
        <div className="md:hidden flex items-center mb-4">
          <Link href="/" className="text-white flex items-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          </Link>
        </div>

        <div className="text-white mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Join our network
          </h1>
          <p className="mb-1 text-sm md:text-base">
            Offer <strong>PayLater</strong> to split servicing and repair work
            into monthly instalments - interest-free.
          </p>
          <p className="text-sm md:text-base">
            Use <strong>PayNow</strong> to take secure payments online.
          </p>
        </div>

        <div className="form-container">
          <div className="p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-1">
              Join our network
            </h2>
            <p className="text-gray-600 mb-5 md:mb-6 text-sm md:text-base">
              Free to join, no monthly fees
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center mb-1 text-sm md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4"
                    />{" "}
                    Name
                  </label>
                  <div className="input-error-container">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`form-input ${
                        errors.name
                          ? "border-red-500"
                          : validFields.name
                          ? "valid"
                          : ""
                      }`}
                    />
                    {errors.name && <span className="input-error-icon">!</span>}
                    {validFields.name &&
                      !errors.name &&
                      focusedField !== "name" && (
                        <span className="input-success-icon">
                          <svg
                            className="h-5 w-5 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="flex items-center mb-1 text-sm md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4"
                    />{" "}
                    Company
                  </label>
                  <div className="input-error-container">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`form-input ${
                        errors.company
                          ? "border-red-500"
                          : validFields.company
                          ? "valid"
                          : ""
                      }`}
                    />
                    {errors.company && (
                      <span className="input-error-icon">!</span>
                    )}
                    {validFields.company &&
                      !errors.company &&
                      focusedField !== "company" && (
                        <span className="input-success-icon">
                          <svg
                            className="h-5 w-5 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                  </div>
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobile_phone"
                    className="flex items-center mb-1 text-sm md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faMobileAlt}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4"
                    />{" "}
                    Mobile phone number
                  </label>
                  <div className="input-error-container">
                    <input
                      type="tel"
                      id="mobile_phone"
                      name="mobile_phone"
                      value={formData.mobile_phone}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`form-input ${
                        errors.mobile_phone
                          ? "border-red-500"
                          : validFields.mobile_phone
                          ? "valid"
                          : ""
                      }`}
                    />
                    {errors.mobile_phone && (
                      <span className="input-error-icon">!</span>
                    )}
                    {validFields.mobile_phone &&
                      !errors.mobile_phone &&
                      focusedField !== "mobile_phone" && (
                        <span className="input-success-icon">
                          <svg
                            className="h-5 w-5 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                  </div>
                  {errors.mobile_phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobile_phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email_address"
                    className="flex items-center mb-1 text-sm md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4"
                    />{" "}
                    Email address
                  </label>
                  <div className="input-error-container">
                    <input
                      type="email"
                      id="email_address"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      className={`form-input ${
                        errors.email_address
                          ? "border-red-500"
                          : validFields.email_address
                          ? "valid"
                          : ""
                      }`}
                    />
                    {errors.email_address && (
                      <span className="input-error-icon">!</span>
                    )}
                    {validFields.email_address &&
                      !errors.email_address &&
                      focusedField !== "email_address" && (
                        <span className="input-success-icon">
                          <svg
                            className="h-5 w-5 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                  </div>
                  {errors.email_address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email_address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="postcode"
                    className="flex items-center mb-1 text-sm md:text-base"
                  >
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4"
                    />{" "}
                    Postcode
                  </label>
                  <div className="input-error-container relative">
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="Start typing to match your address"
                      className={`form-input ${
                        errors.postcode
                          ? "border-red-500"
                          : validFields.postcode
                          ? "valid"
                          : ""
                      }`}
                    />
                    {errors.postcode && (
                      <span className="input-error-icon">!</span>
                    )}
                    {validFields.postcode &&
                      !errors.postcode &&
                      focusedField !== "postcode" && (
                        <span className="input-success-icon">
                          <svg
                            className="h-5 w-5 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}

                    {showPostcodeSuggestions &&
                      postcodeSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-[27px] shadow-md overflow-auto border border-[var(--input-border)]">
                          {postcodeSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                              onMouseDown={() =>
                                handleSelectPostcode(suggestion)
                              }
                            >
                              {highlightMatch(suggestion, formData.postcode)}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  {errors.postcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postcode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start mb-1 text-sm md:text-base">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="text-[var(--primary-color)] mr-1 w-3 md:w-4 h-3 md:h-4 mt-0.5"
                    />
                    <div>
                      <span className="block mb-1">
                        What services are you interested in?
                      </span>
                      <span className="block text-xs md:text-sm text-gray-500">
                        Please select the services you're interested in offering
                        your customers.
                      </span>
                    </div>
                  </label>

                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = !formData.pay_later;
                        setFormData((prev) => ({
                          ...prev,
                          pay_later: newValue,
                        }));

                        // Clear errors immediately if selecting a service
                        if (newValue || formData.pay_now) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.services;
                            return newErrors;
                          });
                        } else {
                          setTimeout(validateServicesFields, 10);
                        }
                      }}
                      className={`service-btn ${
                        formData.pay_later ? "selected" : ""
                      } ${
                        errors.services &&
                        !formData.pay_later &&
                        !formData.pay_now
                          ? "error"
                          : ""
                      }`}
                    >
                      PayLater
                      <span className="service-btn-icon">
                        {formData.pay_later ? (
                          <svg
                            className="h-4 w-4 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : errors.services &&
                          !formData.pay_later &&
                          !formData.pay_now ? (
                          "!"
                        ) : (
                          "+"
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newValue = !formData.pay_now;
                        setFormData((prev) => ({
                          ...prev,
                          pay_now: newValue,
                        }));

                        // Clear errors immediately if selecting a service
                        if (newValue || formData.pay_later) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.services;
                            return newErrors;
                          });
                        } else {
                          setTimeout(validateServicesFields, 10);
                        }
                      }}
                      className={`service-btn ${
                        formData.pay_now ? "selected" : ""
                      } ${
                        errors.services &&
                        !formData.pay_later &&
                        !formData.pay_now
                          ? "error"
                          : ""
                      }`}
                    >
                      PayNow
                      <span className="service-btn-icon">
                        {formData.pay_now ? (
                          <svg
                            className="h-4 w-4 checkmark-animation"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : errors.services &&
                          !formData.pay_later &&
                          !formData.pay_now ? (
                          "!"
                        ) : (
                          "+"
                        )}
                      </span>
                    </button>
                  </div>

                  {errors.services && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.services}
                    </p>
                  )}
                </div>

                {submissionError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md">
                    {submissionError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-green py-3 px-4 rounded-full"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      Register <span className="ml-2">→</span>
                    </>
                  )}
                </button>

                <div className="text-center text-sm mt-4">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-[var(--bumper-green)] hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
