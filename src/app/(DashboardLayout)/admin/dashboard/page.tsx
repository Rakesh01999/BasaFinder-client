"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/Admin"; 
import { getAllListings } from "@/services/Listings";
import { toast } from "sonner";
import { TRentalListing } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign,
  Activity,
  Building,
  MapPin,
  Calendar
} from "lucide-react";

// Define interface for user data
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isBlocked: boolean;
  createdAt?: string;
}

type ListingWithId = TRentalListing & { _id: string; createdAt?: string };

// Chart color schemes
const CHART_COLORS = {
  primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  gradient: ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B']
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [initialListings, setInitialListings] = useState<ListingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30'); // days

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        console.log("response", response);
        if (response.success) {
          setUsers(response.data || []);
        } else {
          toast.error(response.message || "Failed to fetch users");
        }
      } catch (error) {
        toast.error("An error occurred while fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await getAllListings();
        console.log("Listings-", data);
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

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const totalUsers = users.length;
    const totalListings = initialListings.length;
    const landlords = users.filter(user => user.role === 'landlord').length;
    const tenants = users.filter(user => user.role === 'tenant').length;
    const activeUsers = users.filter(user => !user.isBlocked).length;
    const blockedUsers = users.filter(user => user.isBlocked).length;
    
    // Calculate average rent
    const totalRent = initialListings.reduce((sum, listing) => sum + (listing.rentAmount || 0), 0);
    const averageRent = totalListings > 0 ? Math.round(totalRent / totalListings) : 0;
    
    return {
      totalUsers,
      totalListings,
      landlords,
      tenants,
      activeUsers,
      blockedUsers,
      averageRent
    };
  };

  // Prepare chart data
  const getUserRoleData = () => {
    const stats = getDashboardStats();
    return [
      { name: 'Landlords', value: stats.landlords, color: CHART_COLORS.primary[0] },
      { name: 'Tenants', value: stats.tenants, color: CHART_COLORS.primary[1] },
    ];
  };

  const getUserStatusData = () => {
    const stats = getDashboardStats();
    return [
      { name: 'Active', value: stats.activeUsers, color: CHART_COLORS.primary[1] },
      { name: 'Blocked', value: stats.blockedUsers, color: CHART_COLORS.primary[3] },
    ];
  };

  const getRentDistributionData = () => {
    const ranges = [
      { range: '0-10K', min: 0, max: 10000 },
      { range: '10K-20K', min: 10000, max: 20000 },
      { range: '20K-30K', min: 20000, max: 30000 },
      { range: '30K-50K', min: 30000, max: 50000 },
      { range: '50K+', min: 50000, max: Infinity }
    ];

    return ranges.map(range => ({
      range: range.range,
      count: initialListings.filter(listing => 
        listing.rentAmount >= range.min && listing.rentAmount < range.max
      ).length
    }));
  };

  const getBedroomDistributionData = () => {
    const bedroomCounts = initialListings.reduce((acc, listing) => {
      const bedrooms = listing.bedrooms || 0;
      const key = bedrooms > 4 ? '5+' : bedrooms.toString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(bedroomCounts).map(([bedrooms, count]) => ({
      bedrooms: `${bedrooms} BR`,
      count
    }));
  };

  const getLocationData = () => {
    const locationCounts = initialListings.reduce((acc, listing) => {
      const location = listing.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 locations
  };

  const getTimeSeriesData = () => {
    // Mock time series data - in real app, you'd use actual creation dates
    const days = parseInt(selectedTimeRange);
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate data based on actual counts with some variation
      const usersCount = Math.max(0, Math.floor(users.length / days + Math.random() * 5 - 2));
      const listingsCount = Math.max(0, Math.floor(initialListings.length / days + Math.random() * 3 - 1));
      
      data.push({
        date: date.toLocaleDateString(),
        users: usersCount,
        listings: listingsCount,
      });
    }
    
    return data;
  };

  const stats = getDashboardStats();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-100 to-gray-50 dark:from-gray-900 dark:via-gray-700 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Smart rental management analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Listings</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalListings}</p>
              </div>
              <Home className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rent</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">৳{stats.averageRent.toLocaleString()}</p>
              </div>
              <DollarSign className="h-12 w-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.activeUsers}</p>
              </div>
              <Activity className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Roles Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Roles Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getUserRoleData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getUserRoleData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Status Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getUserStatusData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={CHART_COLORS.primary[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rent Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Rent Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getRentDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={CHART_COLORS.primary[2]} 
                  fill={CHART_COLORS.primary[2]}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bedroom Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Properties by Bedrooms
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getBedroomDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bedrooms" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS.primary[4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Width Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Time Series Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Trends (Last {selectedTimeRange} days)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={CHART_COLORS.primary[0]} 
                  strokeWidth={3}
                  name="New Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="listings" 
                  stroke={CHART_COLORS.primary[1]} 
                  strokeWidth={3}
                  name="New Listings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Location Distribution */}
          {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Locations
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={getLocationData()} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="location" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill={CHART_COLORS.primary[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div> */}
          
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/listings">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white bg-blue-600 hover:bg-blue-700 px-8 py-3"
              >
                All Listings
              </Button>
            </Link>
            <Link href="/admin/reviewListings">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white bg-green-600 hover:bg-green-700 px-8 py-3"
              >
                Review All Listings
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button
                variant="default"
                className="rounded-full text-white dark:text-white bg-purple-600 hover:bg-purple-700 px-8 py-3"
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

export default AdminDashboard;