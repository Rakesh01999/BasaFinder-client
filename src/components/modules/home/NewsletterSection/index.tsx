"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success("You've subscribed to our newsletter!");
      setEmail("");
    }, 500);
  };

  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400">
          Stay Updated with BasaFinder 🏡
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Subscribe to receive the latest rental listings, offers, and updates directly in your inbox!
        </p>

        <Card className="max-w-xl mx-auto p-4 shadow-lg bg-white dark:bg-gray-900">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSection;
