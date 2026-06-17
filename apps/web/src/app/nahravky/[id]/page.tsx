import { DEMO_RECORDING_IDS } from "@/lib/demo";
import DetailClient from "./DetailClient";

// Pre statický export (demo na GitHub Pages) vygenerujeme detail pre demo nahrávky.
// V reálnom nasadení (bez exportu) sa detail načíta dynamicky podľa ID.
export function generateStaticParams() {
  return process.env.NEXT_PUBLIC_DEMO === "1"
    ? DEMO_RECORDING_IDS.map((id) => ({ id }))
    : [];
}

export const dynamicParams = process.env.NEXT_PUBLIC_DEMO !== "1";

export default function RecordingDetailPage() {
  return <DetailClient />;
}
