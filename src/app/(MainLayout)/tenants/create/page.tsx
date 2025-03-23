"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
import { useRentalRequest } from "@/context/RentalRequestContext";
import { toast } from "sonner";
import { getSingleUser } from "@/services/Users";
import { createRentalRequest } from "@/services/Requests"; // Import request service
import { IUser } from "@/types";
import { useRouter } from "next/navigation";

const RentalHouseRequest = () => {
  const { user } = useUser();
  const router = useRouter();
  const { listing } = useRentalRequest(); // ✅ Fetch listing data from context

  // State Management
  const [userData, setUserData] = useState<IUser | null>(null);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!user?.userId) return;
    getSingleUser(user.userId).then((res) => {
      if (res?.success) setUserData(res.data);
    });
  }, [user?.userId]);

  // Restrict access to non-tenants
  useEffect(() => {
    if (user?.role !== "tenant") {
      toast.error("Access denied. Only tenants can send rental requests.");
      router.push("/");
    }
  }, [user, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    if (
      !listing?._id ||
      !listing.landlordId ||
      !listing.location ||
      !listing.rentAmount
    ) {
      toast.error("Missing listing details. Please try again.");
      return;
    }

    setLoading(true);

    const rentalRequest = {
      rentalRequest: {
        tenantId: user?.userId,
        rentalHouseId: listing._id,
        landlordId: listing.landlordId,
        location: listing.location,
        rentAmount: Number(listing.rentAmount),
        bedrooms: Number(listing.bedrooms),
        message,
        status: "pending",
        paymentStatus: "pending",
      },
    };

    console.log("Sending Request Data:", rentalRequest);

    try {
      const res = await createRentalRequest(rentalRequest);
      if (res?.success) {
        toast.success("Rental request sent successfully!");
        setMessage("");
        setAgree(false);
        // router.push("/tenant/dashboard"); // Redirect to dashboard
        router.push("/tenants/dashboard"); // Redirect to dashboard
      } else {
        toast.error(res?.message || "Failed to send request.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
      console.error("Request Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Rental House Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information (Auto-populated) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input disabled value={userData?.name || ""} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input disabled value={user?.email || ""} className="mt-2" />
          </div>
        </div>

        {/* Listing Details (Auto-populated) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <Input disabled value={listing?.location || ""} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <Input disabled value={listing?.bedrooms || ""} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Rent Amount
            </label>
            <Input
              disabled
              value={`৳ ${listing?.rentAmount || ""}`}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Landlord ID
            </label>
            <Input
              disabled
              value={listing?.landlordId || ""}
              className="mt-2"
            />
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label className="text-sm font-medium text-gray-700">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="mt-2"
            rows={5}
          />
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={agree}
            onCheckedChange={(checked) => setAgree(!!checked)}
          />
          <span className="text-sm text-gray-600">
            I agree to the terms and conditions.
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Request"}
        </Button>
      </form>
    </div>
  );
};

export default RentalHouseRequest;
