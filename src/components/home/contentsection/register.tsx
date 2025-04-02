"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Button";

interface RegisterProps {
  className?: string;
}

export default function Register({ className = "" }: RegisterProps) {
  return (
    <Button
      href="/form"
      icon={faArrowRight}
      className={`w-fit !bg-[#00C853] hover:!bg-[#00A846] !text-black !text-lg md:!text-xl !py-3 md:!py-4 !px-6 md:!px-8 font-medium ${className}`}
    >
      Register your interest
    </Button>
  );
}
