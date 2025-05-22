"use client";

import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import emailjs from "emailjs-com";
import { FaFacebook, FaWhatsapp, FaTelegram, FaPhone } from "react-icons/fa";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(5, "Message should be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Contact Us</h1>
      <Card className="max-w-2xl mx-auto p-6 shadow-lg bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input {...register("name")} placeholder="Your Name" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Input {...register("email")} type="email" placeholder="Your Email" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Textarea {...register("message")} placeholder="Your Message" rows={5} />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Card>

      {/* ✅ Contact & Social Links */}
      <div className="max-w-2xl mx-auto mt-10 text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">You can also reach us via:</h2>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center text-blue-700 text-lg">
          <a
            href="https://www.facebook.com/rakeshbiswas.biswas.9843/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-800 transition"
          >
            <FaFacebook className="text-xl" /> Facebook
          </a>

          <a
            href="http://wa.me/+8801999647103"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-green-600 transition"
          >
            <FaWhatsapp className="text-xl" /> WhatsApp
          </a>

          <a
            href="https://t.me/Rakesh01999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-500 transition"
          >
            <FaTelegram className="text-xl" /> Telegram
          </a>

          <div className="flex items-center gap-2 text-gray-700">
            <FaPhone className="text-xl" /> Hotline: +8801999647103
          </div>
        </div>
      </div>
    </div>
  );
}
