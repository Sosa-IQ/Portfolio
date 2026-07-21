import { ImageResponse } from "next/og";

export const alt = "Jancarlos Sosa — AI Engineer building reliable agentic systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 78px",
          background: "#0b0d0c",
          color: "#f1eee7",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>
          <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #7de2d1", color: "#7de2d1", fontSize: 18 }}>JS</div>
          Intelligence brief / portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#7de2d1", fontSize: 23, letterSpacing: 5, textTransform: "uppercase" }}>AI Engineer</div>
          <div style={{ fontSize: 88, lineHeight: 0.95, letterSpacing: -4 }}>Jancarlos Sosa</div>
          <div style={{ color: "#aaa9a3", fontSize: 31, maxWidth: 930, lineHeight: 1.3 }}>
            Agentic systems and production software, built with deliberate human controls.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#85867f", fontSize: 20, letterSpacing: 2 }}>
          <span>OBSERVE → REASON → APPROVE → ACT</span>
          <span>jancarlossosa.com</span>
        </div>
      </div>
    ),
    size,
  );
}
