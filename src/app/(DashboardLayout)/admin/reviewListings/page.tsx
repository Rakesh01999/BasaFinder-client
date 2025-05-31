"use client";

import { useEffect, useState } from "react";
import { getAllListings } from "@/services/Listings";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { IUser, TRentalListing } from "@/types";
import { getSingleUser } from "@/services/Users";

const ReviewListings = () => {
  const router = useRouter();
  type ListingWithId = TRentalListing & { _id: string; landlordId: string };
  const [listings, setListings] = useState<ListingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [landlords, setLandlords] = useState<{ [key: string]: IUser }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await getAllListings();
        setListings(data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchLandlordDetails() {
      const landlordData: { [key: string]: IUser } = {};
      await Promise.all(
        listings.map(async (listing) => {
          if (!landlords[listing.landlordId]) {
            try {
              const response = await getSingleUser(listing.landlordId);
              landlordData[listing.landlordId] = response.data;
            } catch (error) {
              console.error("Error fetching landlord details:", error);
            }
          }
        })
      );
      setLandlords((prev) => ({ ...prev, ...landlordData }));
    }
    if (listings.length > 0) {
      fetchLandlordDetails();
    }
  }, [listings, landlords]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-lg my-6 dark:text-black">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">All Listings Overview</h2>

      {loading ? (
        <p className="text-center text-gray-500 flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" />
          Loading listings...
        </p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-[800px] text-sm sm:text-base">
            <TableHeader>
              <TableRow className="dark:hover:bg-gray-100">
                <TableHead>Location</TableHead>
                <TableHead>Rent Amount</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Amenities</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Landlord Name</TableHead>
                <TableHead>Landlord Email</TableHead>
                <TableHead>Landlord Phone No.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing._id} className="hover:bg-gray-50">
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>৳ {listing.rentAmount.toLocaleString()}</TableCell>
                  <TableCell>{listing.bedrooms}</TableCell>
                  <TableCell>{listing.amenities.join(", ")}</TableCell>
                  <TableCell>
                    {listing.isAvailable ? "Available" : "Not Available"}
                  </TableCell>
                  <TableCell>
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {landlords[listing.landlordId]?.name || "Loading..."}
                  </TableCell>
                  <TableCell>
                    {landlords[listing.landlordId]?.email || "Loading..."}
                  </TableCell>
                  <TableCell>
                    {landlords[listing.landlordId]?.phone_number || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReviewListings;
