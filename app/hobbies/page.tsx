import Experience from "@/components/Experience";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("hobbies");

export default function Page() {
  return <Experience initial="hobbies" />;
}
