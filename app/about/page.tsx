import Experience from "@/components/Experience";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("about");

export default function Page() {
  return <Experience initial="about" />;
}
