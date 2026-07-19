"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#0b0d0c", color: "#f1eee7", fontFamily: "system-ui", margin: 0 }}>
        <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#7de2d1", letterSpacing: ".15em", textTransform: "uppercase", fontSize: ".7rem" }}>System interruption</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "clamp(3rem, 8vw, 6rem)", margin: "1rem 0" }}>That route lost the signal.</h1>
          <p style={{ color: "#9a9994" }}>The error is contained. Try the request once more.</p>
          <button onClick={reset} style={{ margin: "1.5rem auto", border: "1px solid #666", color: "inherit", background: "transparent", padding: ".8rem 1rem", cursor: "pointer" }}>Retry</button>
        </main>
      </body>
    </html>
  );
}
