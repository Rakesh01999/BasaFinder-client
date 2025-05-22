'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h1>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is BasaFinder?</AccordionTrigger>
          <AccordionContent>
            BasaFinder is a smart rental and housing solution that connects tenants with verified landlords and listings, ensuring a smooth and secure experience.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do I request a rental?</AccordionTrigger>
          <AccordionContent>
            Simply browse listings, click on one you like, and use the “Request Rent” button. Make sure you are logged in as a tenant.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Can landlords manage their listings?</AccordionTrigger>
          <AccordionContent>
            Yes. Landlords can create, update, or delete listings through their personalized dashboard.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is there an admin panel?</AccordionTrigger>
          <AccordionContent>
            Yes. Admins can monitor users, listings, newsletter subscriptions, and apply coupons or offers via a secure dashboard.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>How secure is my data?</AccordionTrigger>
          <AccordionContent>
            BasaFinder uses secure authentication, encrypted databases, and modern best practices to ensure your data is protected.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
