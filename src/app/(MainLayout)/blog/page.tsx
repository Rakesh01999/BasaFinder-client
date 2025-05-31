"use client";

import { Card } from "@/components/ui/card";

const blogPosts = [
  {
    title: "5 Tips for Finding the Perfect Rental Home",
    excerpt: "Discover practical strategies to secure your ideal living space with ease.",
    date: "March 10, 2025",
  },
  {
    title: "Why You Should Use BasaFinder",
    excerpt: "Learn how BasaFinder simplifies the house-hunting process for tenants and landlords.",
    date: "February 24, 2025",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">Our Blog</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.map((post, idx) => (
          <Card key={idx} className="p-6 bg-white dark:bg-gray-600 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{post.date}</p>
            <p className="text-gray-600 dark:text-gray-100">{post.excerpt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}