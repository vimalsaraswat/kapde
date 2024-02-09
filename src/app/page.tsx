import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-primary">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          The <span className="text-[hsl(280,100%,70%)]">kapde</span> App
        </h1>

        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href="/api/auth/signin"
            className="rounded-full bg-primary/10 px-10 py-3 font-semibold no-underline transition hover:bg-primary/20"
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    </main>
  );
}
