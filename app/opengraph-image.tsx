import { ImageResponse } from "next/og";

export const alt = "PHILOSOPHY Φ — Western philosophy thinkers, ideas and courses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "86px",
        color: "white",
        background: "linear-gradient(135deg, #050505 0%, #161616 55%, #000 100%)",
        border: "2px solid #333",
      }}
    >
      <div style={{ fontSize: 22, letterSpacing: 10, color: "#aaa", marginBottom: 28 }}>
        THE WESTERN CANON
      </div>
      <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: 5 }}>PHILOSOPHY Φ</div>
      <div style={{ width: 180, height: 2, background: "#ddd", margin: "30px 0" }} />
      <div style={{ fontSize: 32, color: "#d4d4d4" }}>
        Thinkers, ideas, primary works and intellectual history
      </div>
    </div>,
    size
  );
}
