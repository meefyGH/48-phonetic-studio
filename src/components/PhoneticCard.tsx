import { Volume2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { speak } from "@/lib/speech";
import type { IPhonetic } from "@/data/phonetics";

interface PhoneticCardProps {
  phonetic: IPhonetic;
  mastered?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  showMastered?: boolean;
  colorClass?: string;
}

export default function PhoneticCard({
  phonetic,
  mastered = false,
  size = "md",
  onClick,
  showMastered = true,
  colorClass,
}: PhoneticCardProps) {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 用第一个例词的发音近似代表音标
    const word = phonetic.examples[0]?.word || "";
    speak(word, 0.7);
  };

  const sizeMap = {
    sm: {
      card: "p-2",
      symbol: "text-xl",
      icon: "size-3.5",
    },
    md: {
      card: "p-4",
      symbol: "text-3xl",
      icon: "size-4",
    },
    lg: {
      card: "p-6",
      symbol: "text-5xl",
      icon: "size-5",
    },
  };

  const s = sizeMap[size];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
        s.card,
        mastered && "border-primary/60 bg-primary/5",
        colorClass,
      )}
    >
      {/* 顶部光晕 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className={cn("font-bold tracking-tight", s.symbol)}>
          {phonetic.symbol}
        </div>
        <button
          type="button"
          onClick={handleSpeak}
          className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          aria-label="播放发音"
        >
          <Volume2 className={s.icon} />
        </button>
      </div>

      {size !== "sm" && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{phonetic.category}</span>
          {phonetic.voiced !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                phonetic.voiced
                  ? "bg-orange-500/15 text-orange-400"
                  : "bg-cyan-500/15 text-cyan-400",
              )}
            >
              {phonetic.voiced ? "浊" : "清"}
            </span>
          )}
        </div>
      )}

      {showMastered && mastered && (
        <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </div>
      )}
    </button>
  );
}
