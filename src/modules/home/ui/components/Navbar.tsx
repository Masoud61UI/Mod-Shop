"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { Button } from "@/src/components/ui/button";

import Container from "./Container";
import Navbarsidebar from "./NavbarSidebar";

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const CheckoutButton = dynamic(
  () => import("@/src/modules/checkout/ui/components/CheckoutButton"),
  {
    ssr: false,
    loading: () => (
      <Button
        disabled
        className="bg-white border border-gray-200 py-5 px-3 rounded-md"
      >
        <ShoppingCartIcon className="text-gray-500" />{" "}
      </Button>
    ),
  }
);

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="default"
      className={cn(
        "bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-800 transition-all text-[15px]",
        isActive && "text-purple-600 hover:text-purple-600"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  {
    href: "/",
    children: "صفحه‌اصلی",
  },
  {
    href: "/products",
    children: "محصولات",
  },
  {
    href: "/blog",
    children: "وبلاگ",
  },
  {
    href: "/about",
    children: "درباره‌ما",
  },
  {
    href: "/contact",
    children: "تماس‌باما",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="h-20 border-b bg-white flex items-center">
      <Container>
        <div className="flex justify-between">
          <Link href={"/"} className="flex items-center">
            <span className="text-2xl font-semibold text-gray-900">
              مد کالکشن
            </span>
          </Link>

          <Navbarsidebar
            items={navbarItems}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          />

          <div className="items-center gap-[6px] hidden lg:flex">
            {navbarItems.map((item) => (
              <NavbarItem
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.children}
              </NavbarItem>
            ))}
          </div>

          <div className="hidden lg:flex gap-4 items-center">
            <CheckoutButton className="relative py-5 px-3 transition-all duration-200 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-md hover:shadow-xl cursor-pointer" />
            {session.data?.user ? (
              <Button
                asChild
                className="p-5 transition-all duration-200 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md shadow hover:shadow-md cursor-pointer font-medium"
              >
                <Link prefetch href="/admin">
                  پروفایل کاربری
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                className="p-5 transition-all duration-200 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md shadow hover:shadow-md cursor-pointer font-medium"
              >
                <Link prefetch href="/login">
                  ثبت‌نام / ورود
                </Link>
              </Button>
            )}
          </div>

          <div className="flex lg:hidden items-center justify-center">
            <Button
              variant="ghost"
              className="size-12 border-transparent bg-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b bg-white flex items-center animate-pulse">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-32 bg-gray-200 rounded-md"></div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-6 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="hidden lg:flex gap-4 items-center">
            <div className="relative">
              <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="h-12 w-32 bg-gray-200 rounded-md"></div>
          </div>

          <div className="flex lg:hidden items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
