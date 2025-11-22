import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  activeCategoryName?: string | null;
  activeCategory?: string | null;
  activeSubcategoryName?: string | null;
}

export default function BreadcrumbNavigation({
  activeCategory,
  activeCategoryName,
  activeSubcategoryName,
}: Props) {
  if (!activeCategory || activeCategoryName === "all") return null;

  return (
    <div className="pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          {activeSubcategoryName ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-sm font-normal text-gray-400"
                >
                  <Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-800 font-medium text-base">
                /
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-gray-800">
                  {activeSubcategoryName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-800">
                {activeCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
