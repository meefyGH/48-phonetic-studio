import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

export const Layout = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* 背景装饰 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[600px] rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
