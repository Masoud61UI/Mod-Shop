import { getQueryClient, trpc } from "@/src/trpc/server";

import Footer from "@/src/modules/home/ui/components/Footer";
import Navbar from "@/src/modules/home/ui/components/Navbar";

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
