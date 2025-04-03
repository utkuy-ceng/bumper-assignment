"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMobileAlt,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
// Import partners data
import partnersData from "../../../data/partners.json";

interface Partner {
  id: string;
  name: string;
  company: string;
  mobile_phone: string;
  email_address: string;
  postcode: string;
  pay_later: boolean;
  pay_now: boolean;
  createdAt?: string;
}

export default function ListPage() {
  const [dealerships, setDealerships] = useState<Partner[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    // Load data from localStorage and partners.json
    const loadDealerships = () => {
      try {
        // Start with the partners from the JSON file
        let allPartners: Partner[] = [...partnersData];

        // Add partners from localStorage if they exist
        const storedData = localStorage.getItem("registeredDealerships");
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Add local storage data
          allPartners = [...allPartners, ...parsedData];
        }

        // Sort by creation date (newest first)
        allPartners.sort((a, b) => {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        });

        // Create a composite key for each dealership to catch functional duplicates
        const seen = new Set<string>();
        const uniquePartners: Partner[] = [];

        for (const partner of allPartners) {
          // Create a composite key using multiple fields
          const key = `${partner.email_address.toLowerCase()}-${
            partner.mobile_phone
          }-${partner.company.toLowerCase()}`;

          if (!seen.has(key)) {
            seen.add(key);
            uniquePartners.push(partner);
          }
        }

        setDealerships(uniquePartners);
        setFilteredDealerships(uniquePartners);
      } catch (error) {
        console.error("Error loading dealership data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDealerships();
  }, []);

  // Filter dealerships based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredDealerships(dealerships);
      return;
    }

    const filtered = dealerships.filter(
      (dealer) =>
        dealer.company.toLowerCase().includes(term) ||
        dealer.name.toLowerCase().includes(term) ||
        dealer.email_address.toLowerCase().includes(term) ||
        dealer.mobile_phone.includes(term)
    );
    setFilteredDealerships(filtered);
  };

  const loadMore = () => {
    setDisplayCount((prev) => prev + 3);
  };

  const displayedDealerships = filteredDealerships.slice(0, displayCount);
  const hasMore = filteredDealerships.length > displayCount;

  return (
    <main className="min-h-screen bg-[#5A698C]">
      <Header />
      <div className="form-bg py-8 md:py-16 min-h-[calc(100vh-72px)]">
        <div
          className="w-full md:w-[60%] min-w-[320px] mx-auto px-4 mt-24 md:mt-4 pb-16"
          style={{ maxWidth: "none" }}
        >
          {/* Header placeholder to push content down - only visible on desktop */}
          <div className="hidden md:block h-[100px] w-full" />

          <div className="text-white mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Interested Dealerships
            </h1>
          </div>

          {/* Search Card */}
          <div className="form-container mb-4">
            <div className="p-4 md:p-6">
              <div className="input-error-container">
                <label
                  htmlFor="search-company"
                  className="flex items-center mb-2"
                >
                  <span className="text-[#FF733C] mr-2">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
                  </span>
                  <span className="font-medium">Search Company</span>
                </label>
                <input
                  id="search-company"
                  type="text"
                  placeholder="Start typing name, company, phone or email for search"
                  className="form-input"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)] mx-auto"></div>
              <p className="mt-4 text-white">Loading dealerships...</p>
            </div>
          ) : filteredDealerships.length === 0 ? (
            <div className="form-container p-6 text-center">
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No dealerships found matching "${searchTerm}"`
                  : "No dealerships have been registered yet."}
              </p>
              <Link
                href="/form"
                className="btn-green py-2 px-6 rounded-full inline-block"
              >
                Register New
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedDealerships.map((dealer) => (
                <div key={dealer.id} className="form-container">
                  <div className="p-6 md:p-8">
                    <h3 className="font-bold text-xl">{dealer.name}</h3>

                    <div className="divide-y divide-gray-200 mt-5">
                      <div className="py-4 flex justify-between items-center">
                        <span className="text-gray-700">Company</span>
                        <span className="text-right">{dealer.company}</span>
                      </div>

                      <div className="py-4 flex justify-between items-center">
                        <span className="text-gray-700">
                          Mobile phone number
                        </span>
                        <span className="text-right">
                          {dealer.mobile_phone}
                        </span>
                      </div>

                      <div className="py-4 flex justify-between items-center">
                        <span className="text-gray-700">Email address</span>
                        <span className="text-right">
                          {dealer.email_address}
                        </span>
                      </div>

                      <div className="py-4 flex justify-between items-center">
                        <span className="text-gray-700">Postcode</span>
                        <span className="text-right">{dealer.postcode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="text-center py-4">
                  <button
                    onClick={loadMore}
                    className="bg-[#3A4A6C] text-white hover:bg-[#2A3A5C] transition-colors py-2 px-8 rounded-md"
                  >
                    Load More...
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
