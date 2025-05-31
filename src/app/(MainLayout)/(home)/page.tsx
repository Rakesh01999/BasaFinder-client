
import HeroSection from "@/components/modules/home/HeroSection";
import HomeBlogSection from "@/components/modules/home/HomeBlogSection";
import HowItWorks from "@/components/modules/home/HowItWorks";
import NewsletterSection from "@/components/modules/home/NewsletterSection";
import RentalListings from "@/components/modules/home/RentalListings";
import Testimonials from "@/components/modules/home/Testimonials";

const HomePage = async () => {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <RentalListings />
      <Testimonials />
      <HomeBlogSection />
      <NewsletterSection />
      {/* <Category />
      <FeaturedProducts />
      <FlashSale />
      <TopBrands /> */}
    </div>
  );
};

export default HomePage;
