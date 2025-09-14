import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-10" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen">
        <Navbar />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="hidden lg:block lg:col-span-3">
                <Sidebar />
              </div>
              <div className="lg:col-span-9">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}