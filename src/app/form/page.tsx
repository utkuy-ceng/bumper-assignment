"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";

// Form validation schema using Zod
const formSchema = z
  .object({
    name: z.string().max(255),
    company: z.string().max(255),
    mobile_phone: z
      .string()
      .regex(
        /^0(\s*)(7)(\s*)(\d(\s*)){9}$/,
        "Mobile phone must be in UK format starting with 07"
      ),
    email_address: z.string().min(5).max(255).email(),
    postcode: z.string().max(30),
    pay_later: z.boolean(),
    pay_now: z.boolean(),
  })
  .refine((data) => data.pay_later || data.pay_now, {
    message: "At least one of 'Pay Later' or 'Pay Now' must be selected",
    path: ["services"],
  });

type FormData = z.infer<typeof formSchema>;

export default function FormPage() {
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
  const [isRegistered, setIsRegistered] = useState(false);

  const validateField = (name: string, value: string | boolean) => {
    try {
      if (name === "name") {
        z.string().max(255).parse(value);
      } else if (name === "company") {
        z.string().max(255).parse(value);
      } else if (name === "mobile_phone") {
        z.string()
          .regex(
            /^0(\s*)(7)(\s*)(\d(\s*)){9}$/,
            "Mobile phone must be in UK format starting with 07"
          )
          .parse(value);
      } else if (name === "email_address") {
        z.string().min(5).max(255).email().parse(value);
      } else if (name === "postcode") {
        z.string().max(30).parse(value);
      } else if (name === "pay_later" || name === "pay_now") {
        z.boolean().parse(value);
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || `Invalid ${name}`;
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
      return false;
    }
  };

  const validateServicesFields = () => {
    try {
      const { pay_later, pay_now } = formData;
      if (!pay_later && !pay_now) {
        setErrors((prev) => ({
          ...prev,
          services: "At least one service must be selected",
        }));
        return false;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.services;
          return newErrors;
        });
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    validateField(name, fieldValue);

    if (name === "pay_later" || name === "pay_now") {
      validateServicesFields();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let isValid = true;

    // Validate all fields
    for (const [key, value] of Object.entries(formData)) {
      if (!validateField(key, value)) {
        isValid = false;
      }
    }

    // Validate services fields
    if (!validateServicesFields()) {
      isValid = false;
    }

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsRegistered(true);
        setTimeout(() => {
          router.push("/list");
        }, 3000);
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-900 p-4 text-white">
          <Link href="/" className="text-white mb-4 block">
            ←
          </Link>
          <h1 className="text-xl font-bold mb-2">Join our network</h1>
          <p className="text-sm">
            Offer PayLater to give servicing and repair work the monthly
            installments - interest-free. Using PayLater is fast, secure
            payments online.
          </p>
        </div>

        {isRegistered ? (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              Registration Successful!
            </h2>
            <p className="mb-4">
              Thank you for registering. You will be redirected to the list page
              shortly.
            </p>
            <Link href="/list" className="text-blue-600 hover:underline">
              Go to List Page →
            </Link>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Join our network</h2>
            <p className="text-sm mb-6">Free to join, no monthly fees</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.company ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="mobile_phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile_phone"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.mobile_phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="07XXX XXXXXX"
                  required
                />
                {errors.mobile_phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobile_phone}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email_address"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email_address ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.email_address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email_address}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="postcode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.postcode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Start typing to match your address"
                  required
                />
                {errors.postcode && (
                  <p className="mt-1 text-sm text-red-500">{errors.postcode}</p>
                )}
              </div>

              <div className="mb-6">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  What services are you interested in?{" "}
                  <span className="text-red-500">*</span>
                </span>

                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="pay_later"
                    name="pay_later"
                    checked={formData.pay_later}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="pay_later"
                    className="ml-2 text-sm text-gray-700"
                  >
                    PayLater
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pay_now"
                    name="pay_now"
                    checked={formData.pay_now}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="pay_now"
                    className="ml-2 text-sm text-gray-700"
                  >
                    PayNow
                  </label>
                </div>

                {errors.services && (
                  <p className="mt-1 text-sm text-red-500">{errors.services}</p>
                )}
              </div>

              {errors.form && (
                <p className="mb-4 text-sm text-red-500">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium"
              >
                {isSubmitting ? "Submitting..." : "Register →"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
