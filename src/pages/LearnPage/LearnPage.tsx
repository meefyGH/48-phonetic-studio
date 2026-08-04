import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Volume2,
  Check,
  ChevronRight,
  Sparkles,
  BookText,
  Lightbulb,
  ListChecks,
  Mic,
} from "lucide-react";
import { MOCK_PHONETICS, type IPhonetic } from "@/data/phonetics";
import { speak } from "@/lib/speech";
import { toggleMastered, getProgress, type IProgressData } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const VOWEL_GROUPS = [
  { name: "前元音", sub: "单元音" },
  { name: "中元音", sub: "单元音" },
  { name: "后元音", sub: "单元音" },
  { name: "合口双元音", sub: "双元音" },
  { name: "集中双元音", sub: "双元音" },
];

const CONSONANT_GROUPS = [
  { name: "爆破音", sub: "清/浊辅音" },
  { name: "摩擦音", sub: "清/浊辅音" },
  { name: "破擦音", sub: "清/浊辅音" },
  { name: "鼻音", sub: "浊辅音" },
  { name: "舌边音", sub: "浊辅音" },
  { name: "半元音", sub: "浊辅音" },
];

export default function LearnPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [progress, setProgress] = useState<IProgressData>(getProgress());
  const [activeType, setActiveType] = useState<"vowel" | "consonant">("vowel");
  const [activeCategory, setActiveCategory] = useState("前元音");

  const currentGroup = MOCK_PHONETICS.filter((p) => p.category === activeCategory);
  const paramPhonetic = searchParams.get("phonetic");

  const [selectedId, setSelectedId] = useState<string>(
    paramPhonetic || currentGroup[0]?.id || "",
  );

  // URL 参数变化时同步
  useEffect(() => {
    if (paramPhonetic) {
      const p = MOCK_PHONETICS.find((x) => x.id === paramPhonetic);
      if (p) {
        setActiveType(p.type);
        setActiveCategory(p.category);
        setSelectedId(p.id);
      }
    }
  }, [paramPhonetic]);

  // 切换分类时选中第一个
  useEffect(() => {
    const group = MOCK_PHONETICS.filter((p) => p.category === activeCategory);
    if (group.length > 0 && !group.find((p) => p.id === selectedId)) {
      setSelectedId(group[0].id);
      setSearchParams({ phonetic: group[0].id }, { replace: true });
    }
  }, [activeCategory, selectedId, setSearchParams]);

  const selected = useMemo(
    () => MOCK_PHONETICS.find((p) => p.id === selectedId),
    [selectedId],
  );

  const handleSelectPhonetic = (p: IPhonetic) => {
    setSelectedId(p.id);
    setSearchParams({ phonetic: p.id }, { replace: true });
    speak(p.examples[0]?.word || "", 0.7);
  };

  const handleToggleMastered = () => {
    if (!selected) return;
    const newProgress = toggleMastered(selected.id);
    setProgress(newProgress);
  };

  const handleSpeakWord = (word: string) => {
    speak(word, 0.8);
  };

  const groups = activeType === "vowel" ? VOWEL_GROUPS : CONSONANT_GROUPS;
  const masteredInGroup = currentGroup.filter((p) =>
    progress.mastered.includes(p.id),
  ).length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">系统学习</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            按分类逐个攻破，掌握一个标记一个
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左侧分类导航 */}
          <aside className="w-full shrink-0 lg:w-64">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3">
                {/* 元音/辅音切换 */}
                <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-muted/50 p-1">
                  <button
                    onClick={() => {
                      setActiveType("vowel");
                      setActiveCategory("前元音");
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      activeType === "vowel"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    元音 20
                  </button>
                  <button
                    onClick={() => {
                      setActiveType("consonant");
                      setActiveCategory("爆破音");
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      activeType === "consonant"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    辅音 28
                  </button>
                </div>

                {/* 分类列表 */}
                <ScrollArea className="h-[calc(100vh-280px)] lg:h-[calc(100vh-260px)]">
                  <div className="space-y-1 pr-2">
                    {groups.map((g) => {
                      const items = MOCK_PHONETICS.filter((p) => p.category === g.name);
                      const mastered = items.filter((p) =>
                        progress.mastered.includes(p.id),
                      ).length;
                      const isActive = activeCategory === g.name;
                      return (
                        <button
                          key={g.name}
                          onClick={() => setActiveCategory(g.name)}
                          className={cn(
                            "w-full rounded-lg px-3 py-2.5 text-left transition-all",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted/50",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{g.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {mastered}/{items.length}
                            </span>
                          </div>
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {g.sub}
                          </div>
                          {/* 进度条 */}
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                isActive ? "bg-primary" : "bg-muted-foreground/30",
                              )}
                              style={{
                                width: `${(mastered / items.length) * 100}%`,
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧内容区 */}
          <div className="flex-1 space-y-6">
            {/* 音标选择器 */}
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{activeCategory}</span>
                  <span className="text-xs text-muted-foreground">
                    已掌握 {masteredInGroup}/{currentGroup.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {currentGroup.map((p) => {
                    const isSelected = p.id === selectedId;
                    const isMastered = progress.mastered.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPhonetic(p)}
                        className={cn(
                          "relative rounded-xl border p-3 text-center transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
                            : "border-border/50 bg-background/50 hover:border-primary/40",
                          isMastered && !isSelected && "border-success/40 bg-success/5",
                        )}
                      >
                        <div className="text-xl font-bold">{p.symbol}</div>
                        {isMastered && (
                          <div className="absolute right-1 top-1 size-4 rounded-full bg-success text-success-foreground">
                            <Check className="mx-auto size-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 详情卡片 */}
            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* 主卡片 - 大号音标 */}
                  <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-purple-500/10">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="text-center md:text-left">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="border-primary/40 text-primary">
                              {selected.category}
                            </Badge>
                            {selected.voiced !== undefined && (
                              <Badge
                                className={cn(
                                  selected.voiced
                                    ? "bg-orange-500/15 text-orange-400"
                                    : "bg-cyan-500/15 text-cyan-400",
                                )}
                                variant="outline"
                              >
                                {selected.voiced ? "浊辅音" : "清辅音"}
                              </Badge>
                            )}
                          </div>
                          <div className="text-7xl font-bold tracking-wider md:text-8xl">
                            {selected.symbol}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            点击播放按钮听发音
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <button
                            onClick={() =>
                              speak(selected.examples[0]?.word || "", 0.6)
                            }
                            className="group relative flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                          >
                            <Volume2 className="size-10" />
                            <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                          </button>
                          <Button
                            onClick={handleToggleMastered}
                            variant={
                              progress.mastered.includes(selected.id)
                                ? "default"
                                : "secondary"
                            }
                            className="gap-2"
                          >
                            <Check className="size-4" />
                            {progress.mastered.includes(selected.id)
                              ? "已掌握 ✓"
                              : "标记已掌握"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 发音要领 + 趣味口诀 */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                            <Mic className="size-4" />
                          </div>
                          <h3 className="font-semibold">发音要领</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {selected.description}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                            <Lightbulb className="size-4" />
                          </div>
                          <h3 className="font-semibold">趣味口诀</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-amber-300/90">
                          💡 {selected.mnemonic}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 常见字母组合 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
                          <BookText className="size-4" />
                        </div>
                        <h3 className="font-semibold">常见字母/字母组合</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selected.letterCombinations.map((lc) => (
                          <Badge
                            key={lc}
                            variant="outline"
                            className="border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-sm text-purple-300"
                          >
                            {lc}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 例词 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                          <ListChecks className="size-4" />
                        </div>
                        <h3 className="font-semibold">
                          例词练习（点击单词听发音）
                        </h3>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {selected.examples.map((ex, idx) => (
                          <motion.button
                            key={ex.word}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ x: 4 }}
                            onClick={() => handleSpeakWord(ex.word)}
                            className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                          >
                            <div>
                              <div className="text-lg font-semibold group-hover:text-primary">
                                {ex.word}
                              </div>
                              <div className="mt-0.5 font-mono text-sm text-muted-foreground">
                                {ex.phonetic}
                              </div>
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                {ex.meaning}
                              </div>
                            </div>
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all group-hover:opacity-100">
                              <Volume2 className="size-4" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 上下音标切换 */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const idx = currentGroup.findIndex(
                          (p) => p.id === selected.id,
                        );
                        if (idx > 0) {
                          handleSelectPhonetic(currentGroup[idx - 1]);
                        }
                      }}
                      disabled={currentGroup.findIndex((p) => p.id === selected.id) === 0}
                      className="gap-1"
                    >
                      <ChevronRight className="size-4 rotate-180" />
                      上一个
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {currentGroup.findIndex((p) => p.id === selected.id) + 1} /{" "}
                      {currentGroup.length}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const idx = currentGroup.findIndex(
                          (p) => p.id === selected.id,
                        );
                        if (idx < currentGroup.length - 1) {
                          handleSelectPhonetic(currentGroup[idx + 1]);
                        }
                      }}
                      disabled={
                        currentGroup.findIndex((p) => p.id === selected.id) ===
                        currentGroup.length - 1
                      }
                      className="gap-1"
                    >
                      下一个
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
