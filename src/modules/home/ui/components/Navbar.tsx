"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/src/lib/utils";
import { useTRPC } from "@/src/trpc/client";
import { Button } from "@/src/components/ui/button";

import Navbarsidebar from "./NavbarSidebar";
import Container from "./Container";

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

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
            <span className="text-2xl font-semibold text-gray-900">مد کالکشن</span>
          </Link>

          <Navbarsidebar
            items={navbarItems}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          />

          <div className="items-center gap-3 hidden lg:flex">
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
            <Button
              asChild
              className="relative py-5 px-3 transition-all duration-200 bg-amber-500 hover:bg-amber-600 text-white rounded-m shadow-lg hover:shadow-xl cursor-pointer"
            >
              <Link href="/cart">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  ۳
                </span>
              </Link>
            </Button>
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
