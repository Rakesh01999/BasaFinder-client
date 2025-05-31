"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  Home,
  Send,
  UserPlus,
  UploadCloud,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

const tenantSteps = [
  {
    icon: <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
    title: "1. Create Account",
    description: "Sign up quickly as a tenant to begin your rental journey.",
  },
  {
    icon: <Home className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
    title: "2. Explore Listings",
    description: "Search rental homes by location, price, bedrooms, and more.",
  },
  {
    icon: <Send className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
    title: "3. Send Request",
    description: "Request your desired rental in one click with a secure profile.",
  },
  {
    icon: <BadgeCheck className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
    title: "4. Move In",
    description: "Get approved and move in with full transparency and ease.",
  },
];

const landlordSteps = [
  {
    icon: <UserPlus className="w-8 h-8 text-gray-600 dark:text-cyan-500" />,
    title: "1. Register as Landlord",
    description: "Create your verified landlord account in a few steps.",
  },
  {
    icon: <UploadCloud className="w-8 h-8 text-gray-600 dark:text-cyan-500" />,
    title: "2. Post Listings",
    description: "Add properties with images, amenities, rent, and availability.",
  },
  {
    icon: <ClipboardList className="w-8 h-8 text-gray-600 dark:text-cyan-500" />,
    title: "3. Manage Requests",
    description: "View, approve, or reject tenant requests from your dashboard.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-gray-600 dark:text-cyan-500" />,
    title: "4. Secure Rentals",
    description: "Enjoy simplified, secure rental management with full control.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-blue-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Whether you are a tenant looking for your next home or a landlord managing rentals, BasaFinder makes the journey effortless and secure.
        </p>

        {/* Tenant Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-6">For Tenants</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tenantSteps.map((step, index) => (
              <Card
                key={index}
                className="text-center p-6 transition-all hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800"
              >
                <CardContent className="flex flex-col items-center gap-4">
                  {step.icon}
                  <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{step.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Landlord Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-cyan-300 mb-6">For Landlords</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {landlordSteps.map((step, index) => (
              <Card
                key={index}
                className="text-center p-6 transition-all hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800"
              >
                <CardContent className="flex flex-col items-center gap-4">
                  {step.icon}
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-cyan-400">{step.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
