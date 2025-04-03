"use client";

import Image from "next/image";
import CTA from "./cta";

export default function HeroSection() {
  return (
    <section
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/images/hero-bg.jpg")',
        minHeight: "65vh",
      }}
    >
      {/* Header placeholder to push content down */}
      <div className="h-[120px] w-full" />

      {/* Content container with responsive spacing */}
      <div className="layout flex flex-col min-h-[calc(65vh-120px)]">
        <div className="flex flex-col pt-6 md:pt-8 lg:pt-10 h-full">
          {/* Content area - all elements with consistent spacing */}
          <div className="flex flex-col">
            {/* Trustpilot badge */}
            <div className="mb-3 md:mb-4 lg:mb-6 relative h-[32px] w-[280px] md:w-[340px]">
              <Image
                src="/images/trustpilot-badge.svg"
                alt="Excellent rating on Trustpilot"
                fill
                sizes="(max-width: 768px) 280px, 340px"
                style={{ objectFit: "contain", objectPosition: "left" }}
                priority
              />
            </div>

            {/* Main heading with updated typography */}
            <h1 className="text-white mb-3 md:mb-4 lg:mb-5 w-full typography-title">
              BECOME A BUMPER APPROVED DEPENDABLE DEALERSHIP
            </h1>

            {/* Description with updated typography */}
            <p className="text-white mb-3 md:mb-4 lg:mb-5 w-full md:w-[70%] lg:w-[45%] typography-description">
              Join our network of 3,000+ garages and dealerships who already
              offer Bumper to their customers.
            </p>

            {/* CTA section */}
            <CTA className="mb-6 md:mb-8 lg:mb-10 w-full md:w-[70%] lg:w-[45%]" />
          </div>

          {/* Spacer to push content to the top */}
          <div className="flex-grow"></div>
        </div>
      </div>
    </section>
  );
}
