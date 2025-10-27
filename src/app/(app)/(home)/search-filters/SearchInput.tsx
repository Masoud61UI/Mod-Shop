import { Input } from "@/src/components/ui/input";
import { SearchIcon } from "lucide-react";

interface Props {
  disabled?: boolean;
}

export default function SearchInput({ disabled }: Props) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative w-full">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-300" />
        <Input
          className="py-5 px-8 
            placeholder:text-sm 
            placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
          placeholder="جستجو محصولات..."
          disabled={disabled}
        />
      </div>
    </div>
  );
}