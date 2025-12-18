"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Menu,
  ShoppingBag,
  Home,
  Package,
  Book,
  Info,
  Phone,
} from "lucide-react";

import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { Button } from "@/src/components/ui/button";

import Container from "./Container";
import Navbarsidebar from "./NavbarSidebar";

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const CheckoutButton = dynamic(
  () => import("@/src/modules/checkout/ui/components/CheckoutButton"),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="ghost"
        size="icon"
        className="relative size-10 rounded-md hover:bg-purple-50 hover:text-purple-500 transition-colors border border-gray-200"
      >
        <ShoppingBag className="size-5 text-gray-600" />
      </Button>
    ),
  }
);

const NavbarItem = ({ href, children, icon, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "h-auto px-4 py-2 bg-transparent hover:bg-purple-50 text-gray-500 hover:text-purple-500 transition-all duration-200 text-sm font-medium rounded-md flex items-center gap-[6px]",
        isActive &&
          "text-purple-600 bg-purple-50 hover:bg-purple-50 hover:text-purple-500 font-semibold"
      )}
    >
      <Link href={href}>
        {icon}
        <span>{children}</span>
      </Link>
    </Button>
  );
};

const navbarItems = [
  {
    href: "/",
    children: "صفحه‌اصلی",
    icon: <Home className="size-4" />,
  },
  {
    href: "/products",
    children: "محصولات",
    icon: <Package className="size-4" />,
  },
  {
    href: "/blog",
    children: "وبلاگ",
    icon: <Book className="size-4" />,
  },
  {
    href: "/about",
    children: "درباره‌ما",
    icon: <Info className="size-4" />,
  },
  {
    href: "/contact",
    children: "تماس‌باما",
    icon: <Phone className="size-4" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="sticky top-0 z-50 h-18 bg-white border-b flex items-center shadow-sm">
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="size-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-sm">
                <ShoppingBag className="size-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full border-[2px] border-white shadow"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">مدکالکشن</span>
              <span className="text-[10px] text-gray-500 font-medium">
                فروشگاه مد و پوشاک
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navbarItems.map((item) => (
              <NavbarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
              >
                {item.children}
              </NavbarItem>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <CheckoutButton className="relative hover:bg-purple-50 hover:text-purple-500 rounded-md transition-colors border border-gray-200" />

            <Button
              asChild
              className={cn(
                "h-9.5 px-4 rounded-md transition-all duration-200 font-medium shadow-sm border-purple-600",
                "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              <Link prefetch href={session.data?.user ? "/admin" : "/login"}>
                {session.data?.user ? "پنل کاربری" : "ورود / ثبت‌نام"}
              </Link>
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <CheckoutButton className="relative hover:bg-purple-50 hover:text-purple-500 rounded-md transition-colors border border-gray-200" />

            <Button
              variant="outline"
              size="icon"
              className="size-10 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-purple-400"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="size-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </Container>

      <Navbarsidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
    </nav>
  );
}

export const NavbarSkeleton = () => {
  return (
    <nav className="sticky top-0 z-50 h-16 border-b bg-white flex items-center animate-pulse">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="hidden lg:flex gap-2.5 items-center">
            <div className="size-10 bg-gray-200 rounded-lg border"></div>
            <div className="h-10 w-32 bg-purple-200 rounded-lg"></div>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <div className="size-10 bg-gray-200 rounded-lg border"></div>
            <div className="size-10 bg-gray-200 rounded-lg border"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
