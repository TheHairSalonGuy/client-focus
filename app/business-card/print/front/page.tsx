import { FrontCard, NAVY } from "@/components/business-card-faces"

// Fixed-size print artboard for the FRONT face.
// Trim card = 672 x 384 px (3.5" x 2" at 192px/inch, matching the approved preview).
// Bleed = 0.125" = 24px on every side -> full artwork 720 x 432 px (3.75" x 2.25").
// The navy background fills the entire bleed area; the card is centered in the trim region.
export default function FrontPrintPage() {
  return (
    <div
      id="print-artboard"
      style={{
        width: 720,
        height: 432,
        backgroundColor: NAVY,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 672 }}>
        <FrontCard />
      </div>
    </div>
  )
}
