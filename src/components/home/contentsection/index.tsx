"use client";

import Image from "next/image";
import Register from "./register";
import Step from "./step";

export default function ContentSection() {
  return (
    <section className="bg-white py-6 md:py-10 lg:py-14">
      <div className="layout">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            {/* BUMPER PAYLATER logo */}
            <div className="mb-8">
              <div className="relative h-6 w-24 mb-3">
                <Image
                  src="/images/bumper-main.svg"
                  alt="Bumper"
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
                  style={{ objectFit: "contain", objectPosition: "left" }}
                />
              </div>
              <h2 className="text-[#1B1B1B] text-4xl md:text-5xl lg:text-[58px] font-bold font-oswald uppercase leading-tight">
                PAYLATER
              </h2>
            </div>

            {/* Intro paragraph */}
            <p className="text-gray-800 text-lg md:text-xl lg:text-[21px] leading-relaxed md:leading-[32px] lg:leading-[32px] mb-8">
              Give customers more flexibility at checkout, online and in store.
              Let them spread the cost with interest-free monthly payments.
            </p>

            {/* Highlighted text */}
            <div className="mb-10">
              <p className="text-[var(--primary-color)] text-2xl md:text-3xl lg:text-[38px] font-medium leading-tight mb-2">
                No risk to your business.
              </p>
              <p className="text-[var(--primary-color)] text-2xl md:text-3xl lg:text-[38px] font-medium leading-tight">
                No worries for your customers.
              </p>
            </div>

            {/* Simple steps */}
            <div className="mb-10">
              <p className="text-base lg:text-[16px] font-medium mb-6">
                It's as simple as:
              </p>

              <Step
                number={1}
                title="FIX IT"
                titleSize="text-base lg:text-[16px] font-bold"
                description="Your customers bring their vehicle to you. You repair and service the car. Everything just like it works right now."
                descriptionSize="text-base lg:text-[16px]"
                className="mb-6"
              />

              <Step
                number={2}
                title="SPLIT IT"
                titleSize="text-base lg:text-[16px] font-bold"
                description="When the customer gets their bill or quote, your customer chooses the option to 'PayLater' and in just a few clicks they've been approved and have paid."
                descriptionSize="text-base lg:text-[16px]"
                className="mb-6"
              />

              <Step
                number={3}
                title="SORTED"
                titleSize="text-base lg:text-[16px] font-bold"
                description="You and your customer part ways happy. You're paid upfront, directly from Bumper, the customer repays Bumper over their chosen payment plan."
                descriptionSize="text-base lg:text-[16px]"
              />
            </div>

            {/* Register button */}
            <div className="mt-10 mb-6">
              <Register />
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-[450px] aspect-[9/16] lg:mr-0">
              <Image
                src="/images/iphone-mockup.png"
                alt="Bumper PayLater interface on a mobile phone"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "contain" }}
                priority
                className="scale-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
