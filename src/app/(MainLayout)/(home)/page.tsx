import Category from "@/components/modules/home/Category";
import FeaturedProducts from "@/components/modules/home/FeaturedProducts";
import FlashSale from "@/components/modules/home/FlashSale";
import HeroSection from "@/components/modules/home/HeroSection";
import Listings from "@/components/modules/home/Listings";
import TopBrands from "@/components/modules/home/TopBrands";

const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <Listings />
      <Category />
      <FeaturedProducts />
      <FlashSale />
      <TopBrands />
    </div>
  );
};

export default HomePage;
