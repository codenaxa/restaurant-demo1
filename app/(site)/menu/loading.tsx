export default function MenuLoading() {
  return (
    <section className="section-shell">
      <div className="section-content grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="editorial-card min-h-[308px] rounded-[0_32px_0_32px] p-5">
            <div className="skeleton-block h-14 w-14 rounded-full" />
            <div className="mt-6 skeleton-block h-10 w-2/3" />
            <div className="mt-5 skeleton-block h-4 w-full" />
            <div className="mt-3 skeleton-block h-4 w-11/12" />
            <div className="mt-3 skeleton-block h-4 w-8/12" />
            <div className="mt-10 skeleton-block h-12 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
