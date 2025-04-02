"use client";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Button";

interface RegisterProps {
  className?: string;
}

export default function Register({ className = "" }: RegisterProps) {
  return (
    <Button href="/form" icon={faArrowRight} className={`w-fit ${className}`}>
      Register your interest
    </Button>
  );
}
