import Experience from "@/components/Experience";
import { metadataFor } from "@/lib/metadata";

export const metadata = metadataFor("projects");

export default function Page() {
  return <Experience initial="projects" />;
}
