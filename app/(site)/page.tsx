import { unstable_noStore as noStore } from "next/cache";

import { AboutSection } from "@/components/home/AboutSection";
import { ChefSection } from "@/components/home/ChefSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { MenuPreview } from "@/components/home/MenuPreview";
import { ReservationStrip } from "@/components/home/ReservationStrip";
import { PageTransition } from "@/components/shared/PageTransition";
import { listMenuItems } from "@/lib/menu-store";
import { getRuntimeEnvValue } from "@/lib/runtime-env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();

  const featuredItems = await listMenuItems({ featuredOnly: true });
  const chefImageUrl =
    (await getRuntimeEnvValue(
      ["CHEF_IMAGE_URL", "NEXT_PUBLIC_CHEF_IMAGE_URL", "chef", "CHEF"],
      "/illustrations/chef-portrait.webp"
    )) || "/illustrations/chef-portrait.webp";

  return (
    <PageTransition>
      <Hero />
      <AboutSection />
      <MenuPreview items={featuredItems} />
      <ChefSection imageUrl={chefImageUrl} />
      <ReservationStrip />
      <ContactSection />
    </PageTransition>
  );
}
