import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Gamepad2, GitCompare, Mic2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "总览", icon: LayoutDashboard },
  { path: "/learn", label: "系统学习", icon: BookOpen },
  { path: "/quiz", label: "趣味测验", icon: Gamepad2 },
  { path: "/compare", label: "易混对比", icon: GitCompare },
  { path: "/mouth", label: "口型图解", icon: Mic2 },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-cyan-400 to-blue-500 text-primary-foreground shadow-lg shadow-primary/30">
            <Zap className="size-5" />
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight">音标战舰</span>
            <span className="text-[10px] text-muted-foreground">Phonetics Battle Ship</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-primary/10" />
                )}
                <Icon className="relative size-4" />
                <span className="relative">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* 右侧装饰 */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5">
            <span className="text-xs text-muted-foreground">连续学习</span>
            <span className="text-sm font-bold text-primary">🔥 1天</span>
          </div>
        </div>
      </div>
    </header>
  );
}
