"use client";

import * as Sentry from "@sentry/nextjs";
import React, { useEffect, type CSSProperties } from "react";

const errorBodyStyle: CSSProperties = {
  margin: 0,
  minHeight: "100dvh",
  background: "#06090d",
  color: "#f3f7fa",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

const errorMainStyle: CSSProperties = {
  boxSizing: "border-box",
  minHeight: "100dvh",
  width: "min(720px, calc(100% - 32px))",
  margin: "0 auto",
  display: "grid",
  alignContent: "center",
  gap: "24px",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "#35e7ff",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: 0,
  maxWidth: "680px",
  fontSize: "clamp(3.5rem, 10vw, 7rem)",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  lineHeight: 0.96,
};

const messageStyle: CSSProperties = { margin: 0, maxWidth: "560px", color: "#a7b2bc", lineHeight: 1.7 };
const buttonStyle: CSSProperties = {
  width: "fit-content",
  border: "1px solid #35e7ff",
  borderRadius: "999px",
  padding: "12px 18px",
  background: "transparent",
  color: "#f3f7fa",
  font: "inherit",
  cursor: "pointer",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={errorBodyStyle}>
        <main id="main-content" style={errorMainStyle}>
          <p style={eyebrowStyle}>System exception</p>
          <h1 style={headingStyle}>Something went wrong.</h1>
          <p style={messageStyle}>An unexpected error interrupted this view. Try loading it again.</p>
          <button onClick={reset} style={buttonStyle} type="button">Try again</button>
        </main>
      </body>
    </html>
  );
}
