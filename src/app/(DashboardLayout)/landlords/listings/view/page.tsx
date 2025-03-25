"use client";

import { useEffect, useState } from "react";
import { getLandlordListings, deleteListing } from "@/services/Listings";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { Edit, Trash2, Loader2, XCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
// import Modal from "@/components/ui/Modal";

const ViewListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const response = await getLandlordListings();
      if (response.success) {
        setListings(response.data || []);
      } else {
        toast.error(response.message || "Failed to load listings");
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  // ✅ Open Delete Confirmation Modal
  const confirmDelete = (listingId: string) => {
    setSelectedListingId(listingId);
    setDeleteModalOpen(true);
  };

  // ✅ Handle Delete Listing
  const handleDelete = async () => {
    if (!selectedListingId) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting listing...");

    try {
      const response = await deleteListing(selectedListingId);
      if (response.success) {
        setListings((prev) => prev.filter((listing) => listing._id !== selectedListingId));
        toast.success("Listing deleted successfully", { id: toastId });
      } else {
        toast.error(response.message || "Failed to delete listing", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setDeleteModalOpen(false);
      setDeleting(false);
      setSelectedListingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Posted Listings</h2>

      {loading ? (
        <p className="text-center text-gray-500 flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" />
          Loading listings...
        </p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Rent Amount</TableCell>
                <TableCell>Bedrooms</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing._id}>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>৳ {listing.rentAmount.toLocaleString()}</TableCell>
                  <TableCell>{listing.bedrooms}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/landlords/listings/edit/${listing._id}`)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(listing._id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ✅ Custom Modal for Delete Confirmation */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6 text-center mx-auto">
          <XCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold">Confirm Deletion</h3>
          <p className="text-gray-600 mt-2">Are you sure you want to delete this listing? This action cannot be undone.</p>

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewListings;
