import { useSession } from "next-auth/react";
import Router from "next/router";

export default function Home() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      Router.push("/signin");
    },
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  Router.push("/admin/dashboard");
}
