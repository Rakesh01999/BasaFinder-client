// const TenantHomePage = () => {
//   return (
//     <div>
//       <div>
//         {/* <h1 className="bg-gradient-to-r from-cyan-500 to-blue-500"> */}
//         <h1 className="text-lg md:text-3xl lg:text-4xl font-bold text-center">
//           Tenant Dashboard
//         </h1>
//         <p className="text-lg md:text-xl lg:text-2xl font-semibold text-center my-4">Welcome to Tenant Dashboard Page</p>
//       </div>
//     </div>
//   );
// };
// export default TenantHomePage;


import { Button } from "@/components/ui/button";
import Link from "next/link";

const TenantHomePage = () => {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center p-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Tenant Dashboard
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-300">
          Welcome to your smart rental management hub.
        </p>
        <div className="mt-10">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Find your listings, make requests, and communicate with
            landlords—all in one place.
          </p>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
            {/* <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
              Go to Dashboard
            </button> */}
            <Link href="/listings">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white"
              >
                View All Listings
              </Button>
            </Link>
            <Link href="/tenants/requests">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white"
              >
                View My Requests Status
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantHomePage;
