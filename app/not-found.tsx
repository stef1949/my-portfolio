import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">Page Not Found</h1>
        <p className="text-muted-foreground">Sorry, we couldn’t find that page.</p>
        <Link href="/" className="underline">Go back home</Link>
      </div>
    </main>
  );
}
