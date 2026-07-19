import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">End of brief</p>
          <p className="footer-statement">Useful systems. Deliberate controls. No theater.</p>
        </div>
        <div className="footer-links">
          <Link href="https://github.com/Sosa-IQ" target="_blank" rel="noreferrer">GitHub ↗</Link>
          <Link href="https://www.linkedin.com/in/jancarlos-sosa/" target="_blank" rel="noreferrer">LinkedIn ↗</Link>
          <Link href="/blog">Writing</Link>
        </div>
        <p className="footer-meta">© {new Date().getFullYear()} Jancarlos Sosa<br />Bridgeport, Connecticut</p>
      </div>
    </footer>
  );
}
