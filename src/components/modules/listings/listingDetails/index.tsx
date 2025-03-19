"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TRentalListing } from "@/types";
import { Star, MapPin, BedDouble, DollarSign } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const ListingDetails = ({ listing }: { listing: TRentalListing }) => {
  const { user, setIsLoading } = useUser();
  // console.log('listing:',listing);
  
  return (
    <Card className="container mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
      {/* Swiper for Listing Images */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 sec
        className="w-full h-80 rounded-xl"
      >
        {listing.images.map((image, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-80">
            <Image
              src={image.replace("http://", "https://") || "/placeholder.jpg"}
              alt={`Listing Image ${idx}`}
              fill
              className="object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <CardContent className="mt-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{listing.location}</h1>
        <p className="text-gray-500">{listing.description}</p>

        <div className="flex items-center gap-4 text-gray-600">
          <MapPin className="w-5 h-5 text-primary" />
          <span>{listing.location}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <BedDouble className="w-5 h-5 text-primary" />
          <span>{listing.bedrooms} Bedrooms</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <DollarSign className="w-5 h-5 text-primary" />
          <span>৳{listing.rentAmount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Amenities: {listing.amenities.join(", ")}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* <Link href="/rental-house-request">
            <Button className="rounded-full px-6 py-2">Request Rent</Button>
          </Link> */}
          {user?.role === "tenant" && (
            <Link 
            href={{
              pathname: "/rental-house-request",
              query: {
                listingId: listing._id,
                location: listing.location,
                rentAmount: listing.rentAmount,
                landlordId: listing.landlordId,
                bedrooms:listing.bedrooms,
              },
            }}
            >
              <Button className="rounded-full px-6 py-2">Request Rent</Button>
            </Link>
          )}
          <Button variant="outline" className="rounded-full px-6 py-2">
            Contact Landlord
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingDetails;
