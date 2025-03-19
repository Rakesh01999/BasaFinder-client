"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { getSingleUser } from "@/services/Users";
import { createRentalRequest } from "@/services/Requests"; // Import request service
import { IUser } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";

const RentalHouseRequest = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const listingId = searchParams.get("listingId");
  const location = searchParams.get("location");
  const rentAmount = searchParams.get("rentAmount");
  const landlordId = searchParams.get("landlordId");
  const bedrooms = searchParams.get("bedrooms");

  console.log({ listingId, location, rentAmount, landlordId, bedrooms });

  const [userData, setUserData] = useState<IUser | null>(null);
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    if (!user?.userId) return;
    const res = await getSingleUser(user.userId);
    if (res?.success) {
      setUserData(res.data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.userId]);

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

    if (!listingId || !landlordId || !location || !rentAmount) {
      toast.error("Invalid listing details.");
      return;
    }

    setLoading(true);

    const rentalRequest = {
      requestData: {
        tenantId: user?.userId,
        rentalHouseId: listingId,
        landlordId,
        location,
        rentAmount: Number(rentAmount),
        bedrooms: Number(bedrooms),
        message,
        status: "pending",
        paymentStatus: "pending",
      },
    };
    console.log("requestData :", rentalRequest);
    const res = await createRentalRequest(rentalRequest);

    if (res?.success) {
      toast.success("Rental request sent successfully!");
      setMessage("");
      setAgree(false);
      router.push("/tenant/dashboard"); // Redirect to tenant dashboard
    } else {
      toast.error(res?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-semibold mb-6">Rental House Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information (Auto-populated) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input disabled value={userData?.name || ""} className="mt-2" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input disabled value={user?.email || ""} className="mt-2" />
        </div>

        {/* Listing Details (Auto-populated) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Location</label>
          <Input disabled value={location || ""} className="mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Rent Amount
            </label>
            <Input disabled value={`৳ ${rentAmount || ""}`} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <Input disabled value={bedrooms || ""} className="mt-2" />
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
        </Button>
      </form>
    </div>
  );
};

export default RentalHouseRequest;
