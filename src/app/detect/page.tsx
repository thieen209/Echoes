import { DetectionExperience } from "@/components/detection-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function DetectPage() {
  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10">
        <DetectionExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
