import { redirect } from "next/navigation";
import LoginPage from "./login/page";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (session?.user) return redirect('/home');

  return <LoginPage />;
}
