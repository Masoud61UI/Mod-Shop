import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/src/components/ui/sheet";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  Home,
  Package,
  Book,
  Info,
  Phone,
  User,
  ShoppingCart,
} from "lucide-react";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Navbarsidebar({ items, open, onOpenChange }: Props) {
  const getIconForItem = (href: string) => {
    switch (href) {
      case "/":
        return <Home className="size-5 ml-3 text-gray-500" />;
      case "/products":
        return <Package className="size-5 ml-3 text-gray-500" />;
      case "/blog":
        return <Book className="size-5 ml-3 text-gray-500" />;
      case "/about":
        return <Info className="size-5 ml-3 text-gray-500" />;
      case "/contact":
        return <Phone className="size-5 ml-3 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 w-72 sm:w-80 transition-none [&_.absolute]:left-4 [&_.absolute]:right-auto"
      >
        <SheetHeader className="p-4 border-b text-right bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="mr-2 text-lg font-bold text-gray-900">
              منوی اصلی
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            منوی اصلی وبسایت مدکالکشن
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          <div className="p-3">
            <div className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-full py-3 px-4 hover:bg-purple-50 flex items-center justify-end text-right rounded-lg transition-colors group"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="text-base font-medium text-gray-700 group-hover:text-purple-700">
                    {item.children}
                  </span>
                  {getIconForItem(item.href)}
                </Link>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-4"></div>

            <div>
              <Link
                href="/checkout"
                className="w-full py-3 px-4 hover:bg-amber-50 flex items-center justify-end text-right rounded-lg transition-colors group"
                onClick={() => onOpenChange(false)}
              >
                <span className="text-base font-medium text-gray-700 group-hover:text-amber-700">
                  سبد خرید
                </span>
                <ShoppingCart className="size-5 ml-3 text-gray-500 group-hover:text-amber-500" />
              </Link>
            </div>

            <div className="mt-4 px-4">
              <Link
                href="/login"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
                onClick={() => onOpenChange(false)}
              >
                <span>ورود به حساب کاربری</span>
                <User className="size-5" />
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
