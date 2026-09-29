import Experience from "@/components/Experience";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("experience");

export default function Page() {
  return <Experience initial="experience" />;
}
