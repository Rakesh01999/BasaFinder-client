import Category from "@/components/modules/home/Category";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import FlashSale from "@/components/modules/home/FlashSale";
import HeroSection from "@/components/modules/home/HeroSection";
import RentalListings from "@/components/modules/home/RentalListings";
import Testimonials from "@/components/modules/home/Testimonials";
import TopBrands from "@/components/modules/home/TopBrands";

const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <RentalListings />
      <Testimonials />
      {/* <Category />
      <FeaturedProducts />
      <FlashSale />
      <TopBrands /> */}
    </div>
  );
};

export default HomePage;
