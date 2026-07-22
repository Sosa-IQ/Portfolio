import Link from "next/link";

import { MobileMenu } from "@/components/MobileMenu";
import { navigation } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/">
          <span className="wordmark-mark" aria-hidden="true">JS</span>
          <span>Jancarlos Sosa</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
