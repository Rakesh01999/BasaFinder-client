"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getTenantRequests, getLandlordRequests, getAllRequests } from "@/services/Requests";
import { TRentalRequest } from "@/types";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ViewRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState<TRentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch rental requests based on user role
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        let response;

        if (user.role === "tenant") {
          response = await getTenantRequests();
        } else if (user.role === "landlord") {
          response = await getLandlordRequests();
        } else if (user.role === "admin") {
          response = await getAllRequests();
        }

        // console.log("API Response:", response);

        if (response?.success) {
          setRequests(response.data || []);
        } else {
          // Handle specific auth errors
          if (response?.message === "Authentication token not found" || 
              response?.message === "You are not authorized!") {
            toast.error("Please login to view your requests");
            // Optionally redirect to login
            // router.push('/login');
          } else {
            toast.error(response?.message || "Failed to fetch rental requests");
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Something went wrong while fetching your requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, router]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
        <p className="text-center text-gray-500">Please log in to view your requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-semibold mb-6">Rental Requests</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No rental requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Rent Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>৳ {request.rentAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        request.status === "pending"
                          ? "bg-yellow-500"
                          : request.status === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/requests/${request._id}`)}
                    >
                      View Details
                    </Button>
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

export default ViewRequests;