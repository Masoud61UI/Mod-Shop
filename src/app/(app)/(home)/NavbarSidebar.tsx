import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription, // اینو اضافه کن
} from "@/src/components/ui/sheet";
import { ScrollArea } from "@/src/components/ui/scroll-area";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Navbarsidebar({ items, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 transition-none [&_.absolute]:left-4 [&_.absolute]:right-auto"
      >
        <SheetHeader className="p-4 border-b text-right">
          <SheetTitle className="mr-2">فهرست</SheetTitle>
          <SheetDescription className="sr-only">
            منوی اصلی وبسایت
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full py-3 px-6 hover:bg-gray-100 flex items-center text-base font-medium text-right justify-end rounded-lg transition-colors"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t mt-4">
            <Link
              href="/cart"
              className="w-full py-3 px-6 mt-2 hover:bg-gray-100 flex items-center text-base font-medium text-right justify-end rounded-lg transition-colors"
            >
              سبد خرید
            </Link>
            <Link
              href="/login"
              className="w-full py-3 px-6 hover:bg-gray-100 flex items-center text-base font-medium text-right justify-end rounded-lg transition-colors"
            >
              ثبت‌نام / ورود
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
