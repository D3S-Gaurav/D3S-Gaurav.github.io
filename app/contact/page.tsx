import Experience from "@/components/Experience";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("contact");

export default function Page() {
  return <Experience initial="contact" />;
}
