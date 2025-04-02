"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Partner = {
  name: string;
  company: string;
  mobile_phone: string;
  email_address: string;
  postcode: string;
  pay_later: boolean;
  pay_now: boolean;
};

export default function ListPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/partners");

        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }

        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching partners:", error);
        setError("Failed to load partners. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const filteredPartners = partners.filter((partner) =>
    partner.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-5xl">
        <div className="bg-blue-900 p-4 text-white rounded-t-lg">
          <h1 className="text-2xl font-bold text-center mb-4">
            Interested Dealerships
          </h1>

          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full p-2 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-white"
                placeholder="Search Company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white p-6 rounded-b-lg shadow-md text-center">
            <p>Loading partners...</p>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-b-lg shadow-md text-center">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="bg-white p-6 rounded-b-lg shadow-md text-center">
            {searchTerm ? (
              <p>No companies found matching "{searchTerm}"</p>
            ) : (
              <div>
                <p>No partners registered yet.</p>
                <Link
                  href="/form"
                  className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-medium"
                >
                  Register a Partner →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
            {filteredPartners.map((partner, index) => (
              <div
                key={index}
                className="p-4 border-b border-gray-200 last:border-b-0"
              >
                <h2 className="text-xl font-semibold">{partner.company}</h2>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Mobile phone number</p>
                    <p>{partner.mobile_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email address</p>
                    <p>{partner.email_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postcode</p>
                    <p>{partner.postcode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Services</p>
                    <p>
                      {[
                        partner.pay_later ? "PayLater" : null,
                        partner.pay_now ? "PayNow" : null,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 text-center">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Load More...
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/form"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-medium"
          >
            Register New Partner →
          </Link>
        </div>
      </div>
    </main>
  );
}
