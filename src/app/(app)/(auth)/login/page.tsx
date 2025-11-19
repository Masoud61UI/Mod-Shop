import { redirect } from "next/navigation";

import { caller } from "@/src/trpc/server";

import { LogInView } from "@/src/modules/auth/ui/views/login-view";

export default async function page() {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return <LogInView />;
}
