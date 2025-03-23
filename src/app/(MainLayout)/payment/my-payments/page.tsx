"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { makePayment, verifyPayment } from "@/services/Payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

// Payment form schema
const paymentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function PaymentPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get request details from URL query params
  const requestId = searchParams.get("requestId");
  const listingId = searchParams.get("listingId");
  const amount = searchParams.get("amount");
  
  // Verify payment if order_id is present in URL
  const order_id = searchParams.get("order_id");
  
  // Form setup
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: user?.name || "",
      phone: "",
      address: "",
    },
  });

  // Handle payment verification
  // useState(() => {
  //   const verifyPaymentStatus = async () => {
  //     if (order_id) {
  //       try {
  //         setIsLoading(true);
  //         const response = await verifyPayment(order_id);
          
  //         if (response.success) {
  //           toast.success("Payment verified successfully!");
  //           // Redirect to payment success page or rental requests
  //           router.push("/rental-requests");
  //         } else {
  //           toast.error(response.message || "Payment verification failed");
  //         }
  //       } catch (error) {
  //         toast.error("Error verifying payment");
  //         console.error(error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };
    
  //   if (order_id) {
  //     verifyPaymentStatus();
  //   }
  // // }, [order_id, router]);
  // }, [router]);

  // Handle form submission
  const onSubmit = async (values: PaymentFormValues) => {
    if (!requestId || !listingId || !amount || !user?.email) {
      toast.error("Missing payment information");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const paymentData = {
        requestId,
        listingId,
        tenantEmail: user.email,
        amount: parseInt(amount),
        name: values.name,
        phone: values.phone,
        address: values.address,
        status: "pending",
      };
      
      const response = await makePayment(paymentData);
      
      if (response.success) {
        toast.success("Payment initiated successfully!");
        
        // Redirect to payment gateway if checkout URL exists
        const checkoutUrl = response?.data?.checkoutUrl;
        if (typeof checkoutUrl === "string" && checkoutUrl.startsWith("https")) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Invalid payment URL received");
        }
      } else {
        toast.error(response.message || "Payment initiation failed");
      }
    } catch (error) {
      toast.error("Error processing payment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-500">Please log in to make a payment.</p>
      </div>
    );
  }

  if (!requestId || !listingId || !amount) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-500">Missing payment information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Please provide your details to proceed with the payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-2 mb-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Amount:</p>
                  <p className="font-bold text-green-600">৳{parseInt(amount).toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}