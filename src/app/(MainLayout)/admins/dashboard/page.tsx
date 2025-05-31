
// const AdminDashboard = () => {
//   return (
//     <div className="p-8 bg-gradient-to-r from-blue-300 to-cyan-200 shadow-lg rounded-3xl">
//       <h1 className="text-center font-bold md:text-lg">Welcome to</h1>
//       <h1 className="text-center font-bold md:text-xl">Admin Dashboard</h1>
//     </div>
//   );
// };

// export default AdminDashboard;



import { Button } from "@/components/ui/button";
import Link from "next/link";

const TenantHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center p-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Admin Dashboard
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-700 dark:text-gray-300">
          Welcome to your smart rental management hub.
        </p>
        <div className="mt-10">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            Manage listings, tenant requests, and manage all users -landlords, tenants —all in one place.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4">
            {/* <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition">
              Go to Dashboard
            </button> */}
            <Link href="/listings">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white"
              >
                All Listings
              </Button>
            </Link>
            <Link href="/admin/reviewListings">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white"
              >
                Review All Listings
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white"
              >
                View All Users
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantHomePage;
