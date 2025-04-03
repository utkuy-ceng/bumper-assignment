"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("business");
  const businessTabRef = useRef<HTMLButtonElement>(null);
  const driversTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  // We'll keep the button text as "Register" permanently
  const buttonText = "Register";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Would typically navigate to different routes here
    // router.push(`/${tab}`);
  };

  // Update indicator position when tab changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeRef =
        activeTab === "business" ? businessTabRef : driversTabRef;
      if (activeRef.current) {
        setIndicatorStyle({
          left: activeRef.current.offsetLeft,
          width: activeRef.current.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <header
      className={
        isMounted
          ? "fixed top-0 left-0 right-0 z-50 w-full"
          : "absolute top-0 left-0 right-0 z-50 w-full"
      }
    >
      {/* Main Container */}
      <div className="relative h-[120px]">
        {/* Orange Background - Full height to ensure it shows through black bar corners */}
        <div className="w-full h-full absolute top-0 left-0 right-0 bg-[#FF733C] border-b border-l border-r border-[#1B1B1B] rounded-b-[16px]">
          {/* Orange section content */}
          <div className="absolute bottom-0 left-0 right-0 h-[67px]">
            <div className="layout flex justify-between items-center h-full">
              <div className="flex items-center">
                <Image
                  src="/images/bumper-main.svg"
                  alt="BUMPER"
                  width={140}
                  height={36}
                  priority
                />
                <div className="ml-2 font-medium text-black">
                  {activeTab === "business" ? "for business" : "for drivers"}
                </div>
              </div>

              <Link
                href="/form"
                className="text-black font-medium py-[6px] px-6 rounded-[4px] bg-[#32BE50] border border-[#1B1B1B] hover:bg-green-600 transition"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Black Navigation Bar on top */}
        <div className="w-full absolute top-0 left-0 right-0 rounded-b-3xl h-[53px] text-white z-10 bg-[#1B1B1B]">
          <div className="layout flex justify-between items-center h-full relative">
            <div className="flex space-x-4">
              <button
                ref={businessTabRef}
                className={`h-full py-2 px-6 font-medium text-white ${
                  activeTab === "business" ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick("business")}
              >
                For business
              </button>
              <button
                ref={driversTabRef}
                className={`h-full py-2 px-6 font-medium text-white ${
                  activeTab === "drivers" ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick("drivers")}
              >
                For drivers
              </button>
            </div>

            {/* Sliding indicator positioned at bottom of black bar with rounded top corners */}
            <div
              className="absolute bottom-0 h-1.5 transition-all duration-300 ease-in-out rounded-t-[4px] bg-[#FF733C]"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />

            {/* Mobile version - icon only */}
            <Link
              href="/login"
              className="md:hidden flex items-center border border-white py-1 px-2 rounded-[4px] hover:bg-gray-800 transition text-white"
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} className="h-4" />
            </Link>

            {/* Desktop version - text + icon */}
            <Link
              href="/login"
              className="hidden md:flex items-center border border-white py-1 px-4 rounded-[4px] hover:bg-gray-800 transition text-white"
            >
              <span className="mr-2">Partner login</span>
              <FontAwesomeIcon icon={faArrowRightToBracket} className="h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
