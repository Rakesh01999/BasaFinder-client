import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TRentalListing } from "@/types";
import { Star, MapPin, BedDouble, DollarSign } from "lucide-react";

const listingDetails = ({ listing }: { listing: TRentalListing }) => {
  return (
    <div className="container mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
      {/* Listing Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Image
          src={
            listing.images[0].replace("http://", "https://") ||
            "/placeholder.jpg"
          }
          alt="Main Image"
          width={600}
          height={400}
          className="rounded-xl w-full h-80 object-cover"
        />
        {/* <Image
          src={
            listing.images[0].replace("http://", "https://") ||
            "/placeholder.jpg"
          }
          alt="Listing Image"
          layout="fill"
          objectFit="cover"
        /> */}
        <div className="grid grid-cols-2 gap-4">
          {listing.images.slice(1, 5).map((image, idx) => (
            <Image
              key={idx}
              //   src={image}
              src={
                listing.images[0].replace("http://", "https://") ||
                "/placeholder.jpg"
              }
              alt={`Image ${idx}`}
              width={300}
              height={200}
              className="rounded-xl w-full h-40 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Listing Info */}
      <div className="mt-8 space-y-4">
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
        <div className="flex gap-6 mt-6">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2">
            Request Rent
          </Button>
          <Button variant="outline" className="rounded-full px-6 py-2">
            Contact Landlord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default listingDetails;
