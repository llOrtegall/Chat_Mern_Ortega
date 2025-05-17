import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth, signOut } from "@/lib/auth";
import { MessageCircleCode } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  console.log(session?.user);

  return (
    <section className="w-full h-svh flex">
      <div className="flex flex-col">
        <header className="flex items-center gap-2 p-4">
          <h1 className="text-2xl font-bold">Chat App Ortega</h1>
          <MessageCircleCode />
        </header>

        <section className="px-4 flex-grow">
          <h2 className="text-lg font-bold">Users Connects</h2>
          <ul>
            <li>user 1</li>
            <li>user 2</li>
            <li>user 3</li>
          </ul>
        </section>

        <footer className="px-4 py-8 space-y-4">

          <article className="flex flex-col gap-2  items-center border py-2 rounded-md bg-blue-50 shadow-sm">
            <p className="text-lg font-bold">Welcome</p>
            <figure className="flex items-center gap-2">
              <figcaption className="ellipsis">{session?.user?.name}</figcaption>
              <Image src={session?.user?.image || ""} alt="image of user logged" width={30} height={30} className="rounded-full" />
            </figure>
          </article>
          <form className="flex justify-center"
            action={async () => {
              "use server"
              await signOut();
            }}>
            <Button type="submit">Sign out</Button>
          </form>
        </footer>

      </div>
      <Separator orientation="vertical" />
      <div>
        <p>secund section</p>
      </div>
    </section>
  )
}