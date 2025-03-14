import ListingBanner from "@/components/modules/listings/banner";
import ProductBanner from "@/components/modules/products/banner";
import ProductDetails from "@/components/modules/products/productDetails";
import ListingDetails from "@/components/modules/listings/listingDetails";
import NMContainer from "@/components/ui/core/NMContainer";
import { getSingleProduct } from "@/services/Product";
import { getSingleListing } from "@/services/Listings";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) => {
  const { listingId } = await params;

  // const { data: product } = await getSingleProduct(productId);
  const { data: listing } = await getSingleListing(listingId);

  return (
    <NMContainer>
      <ListingBanner
        title="Product Details"
        path="Home - Products - Product Details"
      />
      {/* <ProductDetails product={product} /> */}
      <ListingDetails listing={listing} />
    </NMContainer>
  );
};

export default ProductDetailsPage;
