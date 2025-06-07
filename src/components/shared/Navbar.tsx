"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  LogOut,
  User,
  LayoutDashboardIcon,
  Search,
  MapPin,
  Home,
  X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ModeToggle } from "../ui/ModeToggle";
import { getAllListings } from "@/services/Listings";
import { TRentalListing } from "@/types";

// Types
type ListingWithId = TRentalListing & { _id: string };

// Search Results Component
interface SearchResultsProps {
  listings: ListingWithId[];
  onItemClick: () => void;
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  listings,
  onItemClick,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl mt-2 shadow-xl z-50 max-h-96 overflow-y-auto">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3 font-medium">Searching...</p>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl mt-2 shadow-xl z-50">
        <div className="p-6 text-center">
          <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">No listings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl mt-2 shadow-xl z-50 max-h-96 overflow-y-auto">
      {listings.slice(0, 5).map((listing, index) => (
        <Link
          key={listing._id}
          href={`/listings/${listing._id}`}
          onClick={onItemClick}
          className="block hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
        >
          <div
            className={`p-4 flex items-center space-x-4 ${
              index !== listings.slice(0, 5).length - 1
                ? "border-b border-gray-100 dark:border-gray-600"
                : ""
            }`}
          >
            {/* Listing Image */}
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-600 dark:to-gray-700 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
              {listing.images && listing.images.length > 0 ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.location}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-7 h-7 text-blue-500" />
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span className="truncate font-medium">{listing.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ৳{listing.rentAmount.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {listings.length > 5 && (
        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30 rounded-b-xl">
          <Link
            href="/listings"
            onClick={onItemClick}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
          >
            View all {listings.length} results →
          </Link>
        </div>
      )}
    </div>
  );
};

// Main Navbar Component
export default function Navbar() {
  const { user, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const products = useAppSelector(orderedProductsSelector);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Search-related state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ListingWithId[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allListings, setAllListings] = useState<ListingWithId[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await getAllListings();
        setAllListings(data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside search to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const filtered = allListings.filter(
        (listing) =>
          listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          listing.amenities.some((amenity) =>
            amenity.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );

      setSearchResults(filtered);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allListings]);

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (pathname.startsWith("/dashboard")) {
      router.push("/");
    }
  };

  const handleSearchResultClick = () => {
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About-Us", href: "/about" },
    { name: "All-Rentals", href: "/listings" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    // ...(user ? [{ name: "Dashboard", href: `/${user.role}s/dashboard` }] : []),
    ...(user
      ? user.role === "admin"
        ? [{ name: "Dashboard", href: `/${user.role}/dashboard` }]
        : [{ name: "Dashboard", href: `/${user.role}s/dashboard` }]
      : []),
  ];

  return (
    // <header
    //   className={`border-b border-white/20 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 w-full sticky top-0 z-20 transition-all duration-500 backdrop-blur-sm ${
    //     scrolled
    //       ? "shadow-lg shadow-blue-200/20 bg-gradient-to-r from-blue-400/95 via-blue-300/95 to-cyan-300/95"
    //       : ""
    //   }`}
    // >
    <header
      className={`border-b border-white/20 bg-blue-300 w-full sticky top-0 z-20 transition-all duration-500 backdrop-blur-sm ${
        scrolled
          ? "shadow-lg shadow-blue-200/20 bg-blue-400/95 "
          : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* First Row: Logo and Navigation */}
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group"
          >
            <div className="relative">
              <Image
                src={logo}
                alt="BasaFinder Logo"
                width={48}
                height={38}
                // className="w-10 h-auto sm:w-12 md:w-14 lg:w-16 transition-transform duration-300 group-hover:scale-105"
                // className="w-10 h-auto sm:w-12 md:w-14 lg:w-16 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              BasaFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-white/20 backdrop-blur-sm ${
                  pathname === link.href
                    ? "text-gray-900 bg-white/25 shadow-md"
                    : ""
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Mode Toggle */}
            <div className="ml-4">
              <ModeToggle />
            </div>

            {/* User Authentication - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full p-0 h-10 w-10 xl:h-12 xl:w-12 ml-4 ring-2 ring-white/30 hover:ring-white/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <Avatar className="h-10 w-10 xl:h-12 xl:w-12">
                      <AvatarImage src="https://i.postimg.cc/QC0n0Jw6/user.jpg" />
                      <AvatarFallback className="text-sm xl:text-base font-semibold bg-blue-500 text-white">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 xl:w-64 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-white/20 shadow-xl rounded-xl"
                >
                  <DropdownMenuLabel className="text-base font-semibold px-4 py-3">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-600/50" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex w-full cursor-pointer text-sm xl:text-base px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <User className="mr-3 h-5 w-5" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${user.role}s/dashboard`}
                      className="flex w-full cursor-pointer text-sm xl:text-base px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <LayoutDashboardIcon className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-600/50" />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-600 cursor-pointer text-sm xl:text-base px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="ml-4">
                <Button
                  variant="outline"
                  size="default"
                  className="rounded-2xl text-sm xl:text-base px-6 py-2 xl:px-8 xl:py-3 bg-white/90 hover:bg-white hover:text-black text-gray-700 border-white/40 hover:border-white/60 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile & Tablet Controls */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Mode Toggle - Mobile/Tablet */}
            <div className="hidden sm:block lg:hidden">
              <ModeToggle />
            </div>

            {/* Mobile Search Button - Only on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 sm:hidden rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="h-auto bg-blue-400 border-none"
              >
                <div className="sr-only">
                  <DialogTitle>Mobile Search</DialogTitle>
                </div>
                <div className="pt-6 pb-4" ref={searchRef}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-5 py-3 w-full bg-white/90 border-white/30 rounded-2xl text-base"
                      autoFocus
                    />

                    {/* Mobile Search Results */}
                    {showSearchResults && (
                      <SearchResults
                        listings={searchResults}
                        onItemClick={handleSearchResultClick}
                        isLoading={isSearching}
                      />
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Hamburger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300"
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[90%] sm:w-[80%] max-w-sm bg-blue-300 border-none p-0"
              >
                <div className="sr-only">
                  <DialogTitle>Mobile Navigation Menu</DialogTitle>
                </div>

                <div className="p-6 h-full overflow-y-auto">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8 pt-2">
                    <Link
                      href="/"
                      className="flex items-center space-x-3 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={logo}
                        alt="BasaFinder Logo"
                        width={36}
                        height={28}
                        className="w-9 h-auto transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="text-xl font-bold text-gray-800">
                        BasaFinder
                      </span>
                    </Link>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="space-y-2 mb-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-white/20 rounded-xl transition-all duration-300 ${
                          pathname === link.href
                            ? "text-gray-900 bg-white/25 shadow-md"
                            : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mode Toggle - Mobile only */}
                  <div className="mb-6 sm:hidden">
                    <ModeToggle />
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    {/* Mobile User Authentication */}
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-white/20 rounded-xl">
                          <Avatar className="h-12 w-12 ring-2 ring-white/30">
                            <AvatarImage src="https://i.postimg.cc/QC0n0Jw6/user.jpg" />
                            <AvatarFallback className="text-sm font-semibold bg-blue-500 text-white">
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800 text-base">
                              {user.name || "User"}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {user.role || "Member"}
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-white/20 rounded-xl transition-all duration-300"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="mr-3 h-5 w-5" />
                          <span className="font-medium">My Profile</span>
                        </Link>

                        <Link
                          // href={`/${user.role}s/dashboard`}
                          href={user ? (user.role === "admin" ? `/${user.role}/dashboard` : `/${user.role}s/dashboard`) : "#"}
                          className="flex items-center px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-white/20 rounded-xl transition-all duration-300"
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboardIcon className="mr-3 h-5 w-5" />
                          <span className="font-medium">Dashboard</span>
                        </Link>

                        <button
                          onClick={() => {
                            handleLogOut();
                            setIsOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/20 rounded-xl transition-all duration-300"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          <span className="font-medium">Log Out</span>
                        </button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full py-3 text-base font-medium bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Second Row: Search Bar - Desktop Only */}
        <div className="hidden lg:block pb-4">
          <div className="flex justify-center">
            <div
              className="w-full max-w-2xl xl:max-w-3xl relative"
              ref={searchRef}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search properties by location, amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-5 py-3 w-full bg-white/90 dark:bg-gray-800/90 border-white/30 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-white/40 focus:border-white/50 shadow-lg backdrop-blur-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 hover:shadow-xl focus:shadow-xl"
                  onFocus={() => {
                    if (searchQuery.trim() !== "" && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                />

                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <SearchResults
                    listings={searchResults}
                    onItemClick={handleSearchResultClick}
                    isLoading={isSearching}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Tablet Only */}
        <div className="hidden sm:block lg:hidden pb-4 px-4 sm:px-6">
          <div className="relative max-w-md mx-auto" ref={searchRef}>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-5 py-3 w-full bg-white/90 dark:bg-gray-800/90 border-white/30 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-white/40 focus:border-white/50 shadow-lg backdrop-blur-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
              onFocus={() => {
                if (searchQuery.trim() !== "" && searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {showSearchResults && (
              <SearchResults
                listings={searchResults}
                onItemClick={handleSearchResultClick}
                isLoading={isSearching}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
