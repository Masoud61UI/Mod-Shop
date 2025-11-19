import { redirect } from "next/navigation";

import { caller } from "@/src/trpc/server";

import { SignUpView } from "@/src/modules/auth/ui/views/signup-view";

export default async function page() {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }

  return <SignUpView />;
}
