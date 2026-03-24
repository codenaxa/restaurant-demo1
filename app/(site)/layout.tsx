import type { ReactNode } from "react";

import { CartDock } from "@/components/cart/CartDock";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const showAdminLink = Boolean(session);

  return (
    <>
      <Navbar showAdminLink={showAdminLink} />
      <main>{children}</main>
      <Footer showAdminLink={showAdminLink} />
      <CartDock />
    </>
  );
}
