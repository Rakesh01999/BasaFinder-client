"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/assets/logo.png";

// ✅ Zod schema for validating email
const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .refine(
      (email) => {
        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
        ];
        return allowedDomains.some((domain) => email.endsWith(domain));
      },
      {
        message:
          "Please use a valid email domain (gmail.com, yahoo.com, hotmail.com, outlook.com)",
      }
    ),
});

type NewsletterType = z.infer<typeof newsletterSchema>;

const NewsletterSection = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterType>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterType) => {
    toast.success("You've subscribed successfully!");
    reset();
    // 🔒 Optional: Send data to backend or Mailchimp here
  };

  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-200 via-cyan-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition">
      <div className="container mx-auto px-4 text-center">
        {/* <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-400 flex flex-col md:flex-row gap-2">
          <span>Stay Updated with BasaFinder </span>
          <span className="inline-flex mx-auto dark:bg-blue-300 rounded-full">
            <Image
              src={logo}
              alt="BasaFinder Logo"
              width={40}
              height={32}
              className="w-8 h-auto sm:w-10 md:w-12"
            />
          </span>
        </h2> */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-0 text-blue-900 dark:text-blue-400 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-2">
          <span>Stay Updated with BasaFinder</span>
          <span className="inline-flex mx-auto dark:bg-blue-300 rounded-full">
            <Image
              src={logo}
              alt="BasaFinder Logo"
              width={40}
              height={32}
              className="w-8 h-auto sm:w-10 md:w-12"
            />
          </span>
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Subscribe to receive the latest rental listings, offers, and updates
          directly in your inbox!
        </p>

        <Card className="max-w-xl mx-auto p-4 shadow-lg bg-white dark:bg-gray-900">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="w-full">
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 text-left">
                  {errors.email.message}
                </p>
              )}
            </div>
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
