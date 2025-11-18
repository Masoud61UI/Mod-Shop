"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";

export default function page() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());

  return <div>{JSON.stringify(data?.user, null, 2)}</div>;
}
