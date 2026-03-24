import { MenuGrid } from "@/components/menu/MenuGrid";
import { PageTransition } from "@/components/shared/PageTransition";

export default function MenuPage() {
  return (
    <PageTransition>
      <section className="section-shell clip-diagonal bg-ink-2/70">
        <div className="section-content pt-10">
          <p className="section-kicker">Full Collection</p>
          <h1 className="section-title max-w-4xl">
            The complete dining catalogue, filtered by chapter and ready for WhatsApp checkout.
          </h1>
          <div className="gold-divider" />
          <p className="section-copy">
            Every available course is loaded from the menu API, sorted by service order,
            and presented with the same editorial restraint as the home experience.
          </p>
        </div>
      </section>
      <MenuGrid />
    </PageTransition>
  );
}
