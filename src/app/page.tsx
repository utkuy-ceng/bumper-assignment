"use client";

import Header from "@/components/header";
import HeroSection from "@/components/home/herosection";
import ContentSection from "@/components/home/contentsection";

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      <Header />
      <div className="relative">
        <HeroSection />
        <ContentSection />
      </div>
    </main>
  );
}
