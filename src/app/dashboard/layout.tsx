import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full pb-16 md:pb-0">
        <Navbar />
        <div className="p-4 md:p-8 h-full bg-background overflow-y-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
