import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="editorial-card shape-a max-w-2xl p-8 text-center sm:p-10">
        <p className="section-kicker">404</p>
        <h1 className="font-display text-5xl leading-none text-cream sm:text-6xl">
          This course is off the menu
        </h1>
        <p className="mt-5 text-sm leading-7 text-cream-muted sm:text-base">
          The page you requested does not exist in the current service. Return to the
          dining room or browse the menu collection instead.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="gold-button">
            Return Home
          </Link>
          <Link href="/menu" className="ghost-button">
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
