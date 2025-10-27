import { Category } from "@/src/payload-types";
import CategoryDropdown from "./category-dropdown";

interface Props {
  data: any;
}

export default function Categories({ data }: Props) {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center gap-3.5">
        {data.map((category: Category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
