import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowLeftRight, Sparkles, AlertTriangle } from "lucide-react";
import { MOCK_CONFUSING_PAIRS } from "@/data/confusingpairs";
import { MOCK_PHONETICS } from "@/data/phonetics";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ComparePage() {
  const [activeId, setActiveId] = useState(MOCK_CONFUSING_PAIRS[0].id);
  const active = MOCK_CONFUSING_PAIRS.find((p) => p.id === activeId);

  const phoneticMap: Record<string, typeof MOCK_PHONETICS[0]> = {};
  MOCK_PHONETICS.forEach((p) => (phoneticMap[p.id] = p));

  const p1 = active ? phoneticMap[active.phonetic1] : null;
  const p2 = active ? phoneticMap[active.phonetic2] : null;

  const handleSpeak = (word: string) => {
    speak(word, 0.75);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* 标题 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
            <AlertTriangle className="size-4" />
            易混音标对比
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            别再傻傻分不清
          </h1>
          <p className="mt-2 text-muted-foreground">
            7组中国学生最容易搞混的音标，对比着学更清楚
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左侧列表 */}
          <aside className="w-full lg:w-72">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3">
                <ScrollArea className="h-[calc(100vh-240px)] lg:h-[calc(100vh-220px)]">
                  <div className="space-y-1 pr-2">
                    {MOCK_CONFUSING_PAIRS.map((pair, idx) => {
                      const isActive = pair.id === activeId;
                      return (
                        <button
                          key={pair.id}
                          onClick={() => setActiveId(pair.id)}
                          className={cn(
                            "w-full rounded-xl p-3 text-left transition-all",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted/50",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "flex size-6 items-center justify-center rounded-md text-xs font-bold",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-mono text-base font-bold">
                              /{pair.phonetic1}/
                              <span className="mx-1 text-muted-foreground">
                                vs
                              </span>
                              /{pair.phonetic2}/
                            </span>
                          </div>
                          <div className="mt-1 ml-8 text-xs text-muted-foreground">
                            {pair.nickname}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧详情 */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {active && p1 && p2 && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* 对比主卡片 */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { p: p1, side: "left" },
                      { p: p2, side: "right" },
                    ].map(({ p, side }, idx) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                      >
                        <Card
                          className={cn(
                            "overflow-hidden border-2",
                            side === "left"
                              ? "border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-card/80 to-blue-500/5"
                              : "border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-card/80 to-pink-500/5",
                          )}
                        >
                          <CardContent className="p-6 text-center">
                            <Badge
                              className={cn(
                                side === "left"
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-rose-500/20 text-rose-300",
                              )}
                              variant="outline"
                            >
                              {idx === 0 ? "音标 A" : "音标 B"}
                            </Badge>
                            <div className="mt-4 text-6xl font-bold tracking-wider md:text-7xl">
                              {p.symbol}
                            </div>
                            <button
                              onClick={() =>
                                speak(p.examples[0]?.word || "", 0.7)
                              }
                              className={cn(
                                "mt-4 inline-flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95",
                                side === "left"
                                  ? "bg-cyan-500 shadow-cyan-500/30"
                                  : "bg-rose-500 shadow-rose-500/30",
                              )}
                            >
                              <Volume2 className="size-6" />
                            </button>
                            <div className="mt-3 text-sm font-medium">
                              {p.category}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* VS 标识 */}
                  <div className="relative flex items-center justify-center">
                    <div className="h-px flex-1 bg-border" />
                    <div className="mx-4 flex size-12 items-center justify-center rounded-full border border-border bg-card">
                      <ArrowLeftRight className="size-5 text-muted-foreground" />
                    </div>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* 核心区别 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Sparkles className="size-4 text-yellow-500" />
                        核心区别
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {active.keyDifference}
                      </p>
                    </CardContent>
                  </Card>

                  {/* 口型差异 */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-cyan-500/30 bg-cyan-500/5">
                      <CardContent className="p-5">
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-400">
                          <span className="size-2 rounded-full bg-cyan-400" />
                          /{active.phonetic1}/ 口型
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {active.mouthDifference.split("；")[0].replace("左：", "")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-rose-500/30 bg-rose-500/5">
                      <CardContent className="p-5">
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-400">
                          <span className="size-2 rounded-full bg-rose-400" />
                          /{active.phonetic2}/ 口型
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {active.mouthDifference.split("；")[1]?.replace("右：", "") ||
                            active.mouthDifference.split("；")[0].replace("右：", "")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 发音要领对比 */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <h3 className="mb-2 text-sm font-semibold">
                          /{active.phonetic1}/ 发音要领
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {p1.description}
                        </p>
                        <div className="mt-3 rounded-lg bg-amber-500/10 p-3">
                          <p className="text-xs text-amber-300">💡 {p1.mnemonic}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <h3 className="mb-2 text-sm font-semibold">
                          /{active.phonetic2}/ 发音要领
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {p2.description}
                        </p>
                        <div className="mt-3 rounded-lg bg-amber-500/10 p-3">
                          <p className="text-xs text-amber-300">💡 {p2.mnemonic}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 最小对比例词 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold">
                        🔊 最小对比例词（对比听）
                      </h3>
                      <div className="space-y-3">
                        {active.minimalPairs.map((pair, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center gap-4 rounded-xl border border-border/50 bg-background/50 p-4"
                          >
                            <button
                              onClick={() => handleSpeak(pair.word1)}
                              className="group flex flex-1 items-center gap-3 rounded-lg p-2 transition-all hover:bg-cyan-500/10"
                            >
                              <div className="flex size-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 transition-all group-hover:bg-cyan-500 group-hover:text-white">
                                <Volume2 className="size-4" />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">
                                  {pair.word1}
                                </div>
                                <div className="font-mono text-xs text-muted-foreground">
                                  {pair.phonetic1}
                                </div>
                              </div>
                            </button>

                            <div className="text-xs text-muted-foreground">VS</div>

                            <button
                              onClick={() => handleSpeak(pair.word2)}
                              className="group flex flex-1 items-center gap-3 rounded-lg p-2 transition-all hover:bg-rose-500/10"
                            >
                              <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 transition-all group-hover:bg-rose-500 group-hover:text-white">
                                <Volume2 className="size-4" />
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">
                                  {pair.word2}
                                </div>
                                <div className="font-mono text-xs text-muted-foreground">
                                  {pair.phonetic2}
                                </div>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 上下切换 */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const idx = MOCK_CONFUSING_PAIRS.findIndex(
                          (p) => p.id === activeId,
                        );
                        if (idx > 0) setActiveId(MOCK_CONFUSING_PAIRS[idx - 1].id);
                      }}
                      disabled={
                        MOCK_CONFUSING_PAIRS.findIndex((p) => p.id === activeId) === 0
                      }
                    >
                      ← 上一组
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {MOCK_CONFUSING_PAIRS.findIndex((p) => p.id === activeId) + 1} /{" "}
                      {MOCK_CONFUSING_PAIRS.length}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const idx = MOCK_CONFUSING_PAIRS.findIndex(
                          (p) => p.id === activeId,
                        );
                        if (idx < MOCK_CONFUSING_PAIRS.length - 1)
                          setActiveId(MOCK_CONFUSING_PAIRS[idx + 1].id);
                      }}
                      disabled={
                        MOCK_CONFUSING_PAIRS.findIndex((p) => p.id === activeId) ===
                        MOCK_CONFUSING_PAIRS.length - 1
                      }
                    >
                      下一组 →
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
