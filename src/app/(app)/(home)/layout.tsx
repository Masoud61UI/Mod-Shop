import configPromise from "@payload-config";
import { getPayload } from "payload";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { SearchFilters } from "./search-filters";
import { Category } from "@/src/payload-types";
import { CustomCategory } from "./types";

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
