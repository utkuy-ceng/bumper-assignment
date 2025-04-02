"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PartnerLogin from "./partner_login";
import Register from "./register";

export default function Header() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Black navigation bar */}
      <div className="bg-[var(--header-black)] h-12 text-white">
        <div className="layout flex justify-between items-center h-full">
          {/* Left side nav items */}
          <div className="flex items-center space-x-6">
            <Link
              href="/business"
              className="relative"
              onMouseEnter={() => setActiveTab("business")}
              onMouseLeave={() => setActiveTab(null)}
            >
              For business
              {activeTab === "business" && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary-color)]"></div>
              )}
            </Link>
            <Link
              href="/drivers"
              className="relative"
              onMouseEnter={() => setActiveTab("drivers")}
              onMouseLeave={() => setActiveTab(null)}
            >
              For drivers
              {activeTab === "drivers" && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--primary-color)]"></div>
              )}
            </Link>
          </div>

          {/* Right side nav items */}
          <div className="flex items-center space-x-6">
            <PartnerLogin />
            <Register
              isActive={activeTab === "register"}
              onMouseEnter={() => setActiveTab("register")}
              onMouseLeave={() => setActiveTab(null)}
            />
          </div>
        </div>
      </div>

      {/* Orange section */}
      <div className="bg-[var(--primary-color)] h-[64px] rounded-b-3xl border-x-2 border-b-2 border-[var(--header-black)]">
        <div className="layout flex items-center justify-between h-full text-black">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32 bg-[var(--header-black)] text-white rounded-full flex items-center justify-center p-1">
              <Image
                src="/images/bumper-logo.svg"
                alt="Bumper"
                fill
                sizes="(max-width: 768px) 128px, 128px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* CTA button */}
          <div>
            <Link
              href="/join"
              className="bg-[#00C853] hover:bg-[#00A846] text-black font-medium py-2 px-4 rounded transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
