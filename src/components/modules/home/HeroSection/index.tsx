"use client";

import { Button } from "@/components/ui/button";
import Banner from "@/assets/Banner.jpg";
import NMContainer from "@/components/ui/core/NMContainer";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        // className="bg-cover bg-center bg-no-repeat rounded-b-3xl"
        className="w-full bg-cover bg-center bg-no-repeat rounded-b-3xl min-h-[60vh] max-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: `url(${Banner.src})`,
        }}
      >
        <div className="min-h-[60vh] max-h-[70vh] w-full flex items-center justify-start bg-black/50">
          <NMContainer>
            <div className="text-white max-w-2xl px-4 md:px-0">
              <h1 className="md:text-4xl lg:text-5xl font-bold leading-tight">
                Find Your Perfect Home,
                <br />
                Simplified with{" "}
                {/* <span className="text-blue-400">BasaFinder</span> */}
                <li className="text-blue-400">
                  Basa
                  <span className="text-cyan-200">Finder</span>
                </li>
              </h1>
              <p className="mt-4 text-gray-200 text-sm md:text-base">
                Connecting landlords and tenants seamlessly. Discover, rent, and
                manage properties with ease.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href="/listings">
                  <Button
                    // size="lg"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-20 h-8 md:w-full md:h-full"
                  >
                    Rent Now
                  </Button>
                </Link>
                <Link href="/listings">
                  <Button
                    // size="lg"
                    variant="outline"
                    className="rounded-full bg-white text-black hover:bg-blue-600 hover:text-white border border-white w-28 h-8 md:w-full md:h-full"
                  >
                    All Listings
                  </Button>
                </Link>
              </div>
            </div>
          </NMContainer>
        </div>
      </div>

      {/* Scroll hint icon */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
        <ChevronDown size={28} />
      </div>
    </section>
  );
};

export default HeroSection;
