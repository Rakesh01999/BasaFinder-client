"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
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
import { Menu, LogOut, User, LayoutDashboardIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ModeToggle } from "../ui/ModeToggle";

export default function Navbar() {
  const { user, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const products = useAppSelector(orderedProductsSelector);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to apply shadow on scroll
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

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (pathname.startsWith("/dashboard")) {
      router.push("/");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About-Us", href: "/about" },
    { name: "All-Rentals", href: "/listings" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },

    ...(user ? [{ name: "Dashboard", href: `/${user.role}s/dashboard` }] : []),
  ];

  return (
    // <header
    //   className={`border-b bg-gradient-to-r from-blue-300 to-cyan-200  w-full sticky top-0 z-20 transition-all duration-300 ${
    //     scrolled ? "shadow-md" : ""
    //   }`}
    // >
    <header
      className={`border-b bg-gradient-to-r from-blue-300 to-cyan-200 w-full sticky top-0 z-20 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* <div className="container flex items-center justify-between mx-auto h-16 px-4 sm:px-5"> */}
      <div className="container flex items-center justify-between mx-auto h-14 sm:h-16 px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Logo - Responsive sizing */}
        {/* <Link href="/" className="flex items-center space-x-2"> */}
        <Link
          href="/"
          className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0"
        >
          <Image
            src={logo}
            alt="BasaFinder Logo"
            width={40}
            height={32}
            className="w-8 h-auto sm:w-10 md:w-12"
          />
          {/* <span className="text-lg sm:text-xl md:text-2xl font-bold"> */}
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate dark:text-black">
            BasaFinder
          </span>
        </Link>
        {/* <ModeToggle /> */}
        <div className="hidden md:block lg:absolute lg:right-4 xl:static">
          <ModeToggle />
        </div>
        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center space-x-3 lg:space-x-6"> */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm xl:text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap ${
                pathname === link.href ? "font-medium text-blue-600" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Cart with responsive spacing */}
          {/* <Link href="/cart" className="relative ml-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full flex items-center h-9 w-9 p-0 justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              {products?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {products.length > 9 ? '9+' : products.length}
                </span>
              )}
            </Button>
          </Link> */}

          {/* User Authentication - Desktop */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* <Button variant="ghost" className="rounded-full p-0 h-9 w-9">
                  <Avatar className="h-9 w-9"> */}
                <Button
                  variant="ghost"
                  className="rounded-full p-0 h-8 w-8 lg:h-9 lg:w-9"
                >
                  <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                    <AvatarImage src="https://i.postimg.cc/QC0n0Jw6/user.jpg" />
                    <AvatarFallback className="text-xs lg:text-sm">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent align="end" className="w-56"> */}
              <DropdownMenuContent align="end" className="w-48 lg:w-56">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuLabel className="text-sm">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex w-full cursor-pointer text-sm"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${user.role}s/dashboard`}
                    className="flex w-full cursor-pointer"
                  >
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              {/* <Button variant="outline" size="sm" className="rounded-full"> */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-sm px-4"
              >
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation Controls */}
        {/* <div className="flex items-center space-x-3 md:hidden"> */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
          <div className="block md:hidden">
            <ModeToggle />
          </div>
          {/* Cart for Mobile */}
          {/* <Link href="/cart" className="relative">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full flex items-center h-8 w-8 p-0 justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              {products?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {products.length > 9 ? '9+' : products.length}
                </span>
              )}
            </Button>
          </Link> */}

          {/* Mobile Menu Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              // className="w-[80%] sm:w-[300px] bg-gradient-to-r from-blue-300 to-cyan-200"
              className="w-[85%] sm:w-[75%] md:w-[300px] bg-gradient-to-r from-blue-300 to-cyan-200 p-4 sm:p-6"
            >
              {/* Accessibility - Visually Hidden Title */}
              <div className="sr-only">
                <DialogTitle>Mobile Navigation Menu</DialogTitle>
              </div>

              {/* Mobile Menu Header with Close Button */}
              {/* <div className="flex items-center justify-between mb-6 pt-2 "> */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 pt-1 sm:pt-2">
                <Link
                  href="/"
                  // className="flex items-center space-x-2"
                  className="flex items-center space-x-1.5 sm:space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={logo}
                    alt="BasaFinder Logo"
                    width={30}
                    height={24}
                    className="w-6 h-auto sm:w-7"
                  />
                  {/* <span className="text-lg font-bold">BasaFinder</span> */}
                  <span className="text-base sm:text-lg font-bold">
                    BasaFinder
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Links */}
              {/* <div className="flex flex-col space-y-4"> */}
              <div className="flex flex-col space-y-3 sm:space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-1 ${
                      pathname === link.href ? "text-blue-600" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Cart for Mobile Menu */}
                {/* <Link
                  href="/cart"
                  className="flex items-center gap-2 text-base text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Cart {products?.length > 0 ? `(${products.length})` : ""}
                </Link> */}

                {/* Divider */}
                <div className="border-t my-2 sm:my-3" />

                {/* User Authentication for Mobile */}
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 py-1">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src="https://i.postimg.cc/QC0n0Jw6/user.jpg" />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm sm:text-base truncate">
                        {user.name || "User"}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      href={`/${user.role}/dashboard`}
                      className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogOut();
                        setIsOpen(false);
                      }}
                      className="text-sm sm:text-base text-red-600 hover:text-red-700 flex items-center mt-1 sm:mt-2 py-1 transition-colors duration-200"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full text-sm sm:text-base py-2">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
