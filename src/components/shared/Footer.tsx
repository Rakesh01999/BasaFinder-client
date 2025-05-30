import logo from "@/assets/logo.png";
import { FaFacebook, FaWhatsapp, FaTelegram, FaPhone } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/about", label: "About Us" },
    // { href: "/", label: "Testimonial" },
    { href: "/terms-of-use", label: "Terms Of Use" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
  ];

  const socialLinks = [
    { href:"https://www.facebook.com/rakeshbiswas.biswas.9843/", icon: FaFacebook },
    { href: "http://wa.me/+8801999647103", icon: FaWhatsapp },
    { href: "https://t.me/Rakesh01999", icon: FaTelegram },
  ];

  return (
    // <footer className="bg-gradient-to-r from-blue-400 to-cyan-200 border-t border-gray-200 py-12 dark:text-black">
    <footer className="bg-gray-700 border-t border-gray-200 py-12 text-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Intro */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="BasaFinder Logo" width={50} height={40} className="bg-blue-300 rounded-full " />
            <h1 className="text-2xl font-bold">BasaFinder</h1>
          </div>
          <p className=" mt-3 max-w-md text-sm">
            Connecting landlords and tenants seamlessly. Discover, rent, and
            manage properties with ease. Your ideal rental journey starts here.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-200 font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-300 transition-all">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map(({ href, icon: Icon }, index) => (
            <Link
              href={href}
              key={index}
              target="_blank"
              className="text-gray-300 hover:text-blue-300 transition-all"
            >
              <Icon className="w-5 h-5" />
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-center">
          © {new Date().getFullYear()} BasaFinder. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;