"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ListingCard from "@/components/ui/core/ListingCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllListings } from "@/services/Listings";
import { TRentalListing } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ListingWithId = TRentalListing & { _id: string };

interface RentalListingsProps {
  initialListings: ListingWithId[];
  isLoading: boolean;
}

const RentalListings: React.FC<RentalListingsProps> = ({
  initialListings,
  isLoading,
}) => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [bedrooms, setBedrooms] = useState("any");
  const [filteredListings, setFilteredListings] =
    useState<ListingWithId[]>(initialListings);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  // Calculate pagination values
  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = filteredListings.slice(startIndex, endIndex);

  useEffect(() => {
    setFilteredListings(initialListings);
    setCurrentPage(1); // Reset to first page when initialListings change
  }, [initialListings]);

  const handleSearch = () => {
    const filtered = initialListings.filter((listing: ListingWithId) => {
      const locationMatch =
        location === "" ||
        listing.location.toLowerCase().includes(location.toLowerCase());

      const priceMatch =
        listing.rentAmount >= priceRange[0] &&
        listing.rentAmount <= priceRange[1];

      const bedroomsMatch =
        bedrooms === "any" || listing.bedrooms.toString() === bedrooms;

      return locationMatch && priceMatch && bedroomsMatch;
    });

    setFilteredListings(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  const handleReset = () => {
    setLocation("");
    setPriceRange([0, 50000]);
    setBedrooms("any");
    setFilteredListings(initialListings);
    setCurrentPage(1); // Reset to first page after reset
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis logic
      if (currentPage <= 3) {
        // Show first 4 pages + ellipsis + last page
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > 5) {
          pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 4 pages
        pageNumbers.push(1);
        if (totalPages > 5) {
          pageNumbers.push('...');
        }
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <NMContainer className="my-20">
      {/* Search Section */}
      <div className="bg-white dark:bg-gray-300 p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-xl font-semibold mb-4 text-center dark:text-black">
          Search Rental Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-black">
              Location
            </label>
            <Input
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-black">
              Price Range
            </label>
            <div className="px-2">
              <Slider
                defaultValue={[0, 50000]}
                min={0}
                max={50000}
                step={1000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                className="mt-2"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-black">
                <span>৳{priceRange[0].toLocaleString()}</span>
                <span>৳{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-black">
              Bedrooms
            </label>
            <Select
              value={bedrooms}
              onValueChange={(value) => setBedrooms(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
            >
              Search
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-blue-300 text-blue-600 dark:text-white"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Listings Header with Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">All Listings</h2>
          {!isLoading && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
            </p>
          )}
        </div>
        
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span> */}
          <span className="text-sm text-gray-600 dark:text-gray-200">Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              const newItemsPerPage = parseInt(value);
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <SelectTrigger className="w-20 border-gray-500 dark:border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="16">16</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: itemsPerPage }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-64 w-full rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))
        ) : currentListings.length > 0 ? (
          currentListings.map((listing: ListingWithId, idx: number) => (
            <ListingCard
              key={listing._id}
              listing={{
                id: listing._id,
                location: listing.location,
                rentAmount: listing.rentAmount,
                bedrooms: listing.bedrooms,
                amenities: listing.amenities,
                description: listing.description,
                images: listing.images,
              }}
            />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">
            <p className="text-lg text-gray-500">
              No listings match your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredListings.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 dark:text-gray-200">
            Page {currentPage} of {totalPages}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum as number)}
                      className={`min-w-[40px] ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Jump to Page */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">Go to:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              placeholder="Page"
              className="w-16 md:w-20 h-8 text-center border-gray-500 dark:border-gray-300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </NMContainer>
  );
};

// Wrapper Component: Handles Data Fetching
export default function RentalListingsPage() {
  const [initialListings, setInitialListings] = useState<ListingWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await getAllListings();
        setInitialListings(data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setInitialListings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <RentalListings initialListings={initialListings} isLoading={isLoading} />
  );
}