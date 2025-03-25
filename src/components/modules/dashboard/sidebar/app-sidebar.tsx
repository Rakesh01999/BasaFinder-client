// src/components/modules/dashboard/sidebar/app-sidebar.tsx

"use client";

import * as React from "react";
import {
  Bot,
  Building,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  SquareTerminal,
  Users,
  Wallet,
  FileText,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import Logo from "@/assets/svgs/Logo";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  
  // Determine if the user is a landlord based on the URL path
  const isLandlord = pathname.includes('/landlords');
  
  // Define navigation data based on user type
  const tenantNavData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/tenants/dashboard",
        icon: SquareTerminal,
        isActive: pathname === "/tenants/dashboard",
      },
      {
        title: "Manage Rental Requests",
        url: "/tenants/my-profile",
        icon: Bot,
        items: [
          {
            title: "View Rental Request",
            url: "/tenants/requests",
          },
          {
            title: "Payment History",
            url: "/payment/my-payments",
          },
        ],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Account Settings",
        url: "/update-profile",
        icon: Settings,
        items: [
          {
            title: "Update Profile",
            url: "/update-profile",
          },
          {
            title: "Change Password",
            url: "/change-password",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };

  const landlordNavData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/landlords/dashboard",
        icon: SquareTerminal,
        isActive: pathname === "/landlords/dashboard",
      },
      {
        title: "Manage Listings",
        url: "/landlords/listings",
        icon: Building,
        items: [
          {
            title: "All Listings",
            // url: "/landlords/listings",
            url: "/listings",
          },
          {
            title: "Post/Add New Listing",
            // url: "/landlords/listings/add",
            url: "/landlords/listings",
          },
          {
            title: "View My Listing",
            url: "/landlords/listings/view",
          },
        ],
      },
      {
        title: "Rental Requests",
        url: "/landlords/requests",
        icon: FileText,
        items: [
          {
            title: "All Requests",
            url: "/landlord/requests",
          },
          {
            title: "Pending Requests",
            url: "/landlord/requests/pending",
          },
          // {
          //   title: "Approved Requests",
          //   url: "/landlords/requests/approved",
          // },
          // {
          //   title: "Rejected Requests",
          //   url: "/landlords/requests/rejected",
          // },
        ],
      },
      // {
      //   title: "Payments",
      //   url: "/landlords/payments",
      //   icon: Wallet,
      //   items: [
      //     {
      //       title: "Received Payments",
      //       url: "/landlords/payments/received",
      //     },
      //     {
      //       title: "Payment History",
      //       url: "/landlords/payments/history",
      //     },
      //   ],
      // },
      {
        title: "Profile",
        url: "/profile",
        icon: User,
      },
      {
        title: "Account Settings",
        url: "/update-profile",
        icon: Settings,
        items: [
          {
            title: "Update Profile",
            url: "/update-profile",
          },
          {
            title: "Change Password",
            url: "/change-password",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Help Center",
        url: "/help",
        icon: LifeBuoy,
      },
      {
        title: "Contact Us",
        url: "/contact",
        icon: Send,
      },
    ],
  };

  // Choose the correct nav data based on user type
  const data = isLandlord ? landlordNavData : tenantNavData;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <h2 className="font-bold text-xl">Basa Finder</h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}