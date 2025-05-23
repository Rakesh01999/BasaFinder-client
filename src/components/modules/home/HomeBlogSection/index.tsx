"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const blogs = [
  {
    id: 1,
    title: "10 Tips for First-Time Renters",
    image: "https://i.postimg.cc/HsLMcTK4/1726687662933.png",
    summary: "Get prepared with everything you need to know before renting your first apartment.",
    date: "May 20, 2025",
    fullStory:
      "Renting your first home can feel overwhelming. In this guide, we cover essential steps including budgeting, location research, lease terms, and inspection checklists to ensure a smooth transition into your new place.",
  },
  {
    id: 2,
    title: "How to Choose the Right Neighborhood",
    image: "https://i.postimg.cc/3xxHQckw/How-To-Choose.jpg",
    summary: "Explore the key factors you should consider before picking your next neighborhood.",
    date: "May 10, 2025",
    fullStory:
      "Choosing a neighborhood goes beyond aesthetics. Learn how to evaluate safety, amenities, public transport, schools, and community vibe to make the best decision for your lifestyle.",
  },
  {
    id: 3,
    title: "Top 5 Rental Scams and How to Avoid Them",
    image: "https://i.postimg.cc/5N1XLbRk/Apartment.jpg",
    summary: "Stay alert and safe with our guide to the most common rental scams.",
    date: "April 25, 2025",
    fullStory:
      "Scammers prey on renters through fake listings and impersonation. We'll walk you through red flags to watch for, how to verify listings, and what to do if you suspect fraud.",
  },
  {
    id: 4,
    title: "Furnished vs Unfurnished Apartments",
    image: "https://i.postimg.cc/dtM8fbS8/FURNISHED-VS-UNFURNISHED-APARTMENT-1.png",
    summary: "Not sure whether to go for a furnished or empty unit? Here's a comparison to help you decide.",
    date: "April 15, 2025",
    fullStory:
      "We break down the pros and cons of furnished and unfurnished rentals, covering flexibility, costs, setup effort, and ideal situations for each type.",
  },
];

export default function HomeBlogSectionWithModal() {
  const [openBlog, setOpenBlog] = useState<null | typeof blogs[0]>(null);

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-12 bg-gray-50 dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-400 mb-3">Latest Blog Posts</h2>
          <p className="text-gray-500 dark:text-gray-300">Insights, tips, and stories from the rental world</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition"
              onClick={() => setOpenBlog(blog)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{blog.date}</p>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{blog.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{blog.summary}</p>
                <Button variant="link" className="text-blue-400 px-0">Read More →</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openBlog && (
        <Dialog open={!!openBlog} onOpenChange={() => setOpenBlog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{openBlog.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Image
                src={openBlog.image}
                alt={openBlog.title}
                width={600}
                height={300}
                className="rounded-md w-full object-cover"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">{openBlog.date}</p>
              <p className="text-gray-700 dark:text-gray-300">{openBlog.fullStory}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
