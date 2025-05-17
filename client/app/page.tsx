import { auth } from "@/lib/auth";

import LoginPage from "./login/page";
import Home from "./home/page"

export default async function Page() {
  const session = await auth();

  return (
    <main>
      {
        session ? (
          <Home />
        ) : (
          <LoginPage />
        )
      }
    </main>
  );
}
