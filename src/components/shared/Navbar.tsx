"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, ShoppingCart, User } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const { user, setIsLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const products = useAppSelector(orderedProductsSelector);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    setIsLoading(true);
    if (pathname.startsWith("/dashboard")) {
      router.push("/");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "All Rentals", href: "/listings" },
    ...(user ? [{ name: "Dashboard", href: `/${user.role}/dashboard` }] : []),
  ];

  return (
    <header className="border-b bg-white w-full sticky top-0 z-20">
      <div className="container flex items-center justify-between mx-auto h-16 px-5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logo} alt="BasaFinder Logo" width={50} height={40} />
          <span className="text-2xl font-bold">BasaFinder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-700 hover:text-blue-600 transition">
              {link.name}
            </Link>
          ))}
          
          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="outline" className="rounded-full flex items-center">
              <ShoppingCart className="w-5 h-5" />
              {products?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
                  {products.length}
                </span>
              )}
            </Button>
          </Link>

          {/* User Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://i.postimg.cc/QC0n0Jw6/user.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/${user.role}/dashboard`}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="rounded-full">Login</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu (Hamburger) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4 mt-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-lg font-medium text-gray-700 hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}

              {/* Cart for Mobile */}
              <Link href="/cart" className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>
                <ShoppingCart className="w-5 h-5" />
                Cart ({products.length ?? 0})
              </Link>

              {/* User Authentication for Mobile */}
              {user ? (
                <>
                  <Link href="/profile" className="text-lg text-gray-700 hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>
                    My Profile
                  </Link>
                  <Link href={`/${user.role}/dashboard`} className="text-lg text-gray-700 hover:text-blue-600 transition" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogOut} className="text-lg text-red-600 hover:underline mt-2">
                    Log Out
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
