import { PreviewBanner } from "@/components/PreviewBanner";
import { VisitTracker } from "@/components/VisitTracker";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PreviewBanner />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <VisitTracker />
    </div>
  );
}
