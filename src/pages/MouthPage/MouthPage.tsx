import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Volume2,
  Sparkles,
  Hand,
  CircleDot,
  Circle,
} from "lucide-react";
import { MOCK_PHONETICS } from "@/data/phonetics";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// 口型大小对应的 SVG 嘴巴高度
const mouthSizeMap = {
  small: 12,
  medium: 22,
  large: 36,
};

// 简单的口型 SVG 组件
function MouthDiagram({
  openness,
  lipShape,
  voiced,
  isBiting = false,
  isRounded = false,
}: {
  openness: "small" | "medium" | "large";
  lipShape: string;
  voiced: boolean;
  isBiting?: boolean;
  isRounded?: boolean;
}) {
  const height = mouthSizeMap[openness];
  const width = isRounded ? height * 0.8 : height * 1.8;

  return (
    <div className="relative flex flex-col items-center">
      {/* 面部轮廓 */}
      <div className="relative flex size-40 items-center justify-center rounded-full bg-gradient-to-b from-amber-100/90 to-amber-200/80 shadow-inner">
        {/* 眼睛 */}
        <div className="absolute top-10 flex gap-6">
          <div className="size-2.5 rounded-full bg-stone-800" />
          <div className="size-2.5 rounded-full bg-stone-800" />
        </div>

        {/* 嘴巴 */}
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-b from-red-400 to-red-600 transition-all duration-500",
            isRounded ? "rounded-full" : "rounded-b-full",
          )}
          style={{ width: `${width}px`, height: `${height}px`, marginTop: "20px" }}
        >
          {/* 牙齿 */}
          {openness !== "small" && (
            <div className="absolute top-0 left-1/2 h-2 -translate-x-1/2 bg-white/90"
              style={{ width: `${width * 0.7}px`, borderRadius: "0 0 4px 4px" }}
            />
          )}
          {/* 咬舌 */}
          {isBiting && (
            <div className="absolute top-1 left-1/2 h-3 w-8 -translate-x-1/2 rounded-full bg-pink-300" />
          )}
          {/* 舌头 */}
          {openness !== "small" && !isBiting && (
            <div
              className="absolute bottom-0 left-1/2 h-3 -translate-x-1/2 rounded-t-full bg-pink-400"
              style={{ width: `${width * 0.5}px` }}
            />
          )}
        </div>

        {/* 声带振动指示 */}
        {voiced && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -bottom-2 flex size-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg"
          >
            <Sparkles className="size-3" />
          </motion.div>
        )}
      </div>

      {/* 说明 */}
      <div className="mt-3 text-center">
        <div className="text-sm font-medium">{lipShape}</div>
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>开口度：</span>
          <div className="flex gap-1">
            {["small", "medium", "large"].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full",
                  s === "small" && "w-2",
                  s === "medium" && "w-3",
                  s === "large" && "w-4",
                  openness === s ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 根据音标特征推断口型
function getMouthFeatures(phonetic: typeof MOCK_PHONETICS[0]) {
  const id = phonetic.id;
  let openness: "small" | "medium" | "large" = "medium";
  let isRounded = false;
  let isBiting = false;

  // 开口度判断
  if (["iː", "ɪ", "uː", "ʊ", "w", "j", "m"].includes(id)) {
    openness = "small";
  } else if (
    ["e", "ɜː", "ə", "ʌ", "ɔː", "ɒ", "o", "əʊ", "p", "b", "f", "v", "s", "z", "ʃ", "ʒ"].includes(id)
  ) {
    openness = "medium";
  } else if (["æ", "ɑː", "aɪ", "aʊ", "h", "k", "g"].includes(id)) {
    openness = "large";
  }

  // 圆唇
  if (["uː", "ʊ", "ɔː", "ɒ", "o", "əʊ", "w", "r"].includes(id)) {
    isRounded = true;
  }

  // 咬舌
  if (["θ", "ð"].includes(id)) {
    isBiting = true;
    openness = "medium";
  }

  return { openness, isRounded, isBiting };
}

// 舌位示意图
function TongueDiagram({ position }: { position: string }) {
  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-gradient-to-b from-pink-100/50 to-pink-200/50">
      {/* 上颚线 */}
      <div className="absolute top-2 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-amber-100 to-amber-200" />
      {/* 舌头 */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-pink-400 to-pink-300"
        animate={{
          y: position.includes("前") ? -8 : position.includes("后") ? 8 : 0,
          scaleY: position.includes("高") ? 1.2 : 1,
        }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-pink-700">
        舌位：{position}
      </div>
    </div>
  );
}

export default function MouthPage() {
  const [activeTab, setActiveTab] = useState<"vowel" | "consonant">("vowel");
  const [selectedId, setSelectedId] = useState("iː");
  const [showVibration, setShowVibration] = useState(false);

  const vowels = MOCK_PHONETICS.filter((p) => p.type === "vowel");
  const consonants = MOCK_PHONETICS.filter((p) => p.type === "consonant");

  const currentList = activeTab === "vowel" ? vowels : consonants;
  const selected = useMemo(
    () => MOCK_PHONETICS.find((p) => p.id === selectedId),
    [selectedId],
  );

  const features = selected ? getMouthFeatures(selected) : null;

  // 舌位描述
  const tonguePosition = useMemo(() => {
    if (!selected) return "中";
    if (selected.category === "前元音") return "前高";
    if (selected.category === "中元音") return "中";
    if (selected.category === "后元音") return "后";
    if (selected.category === "合口双元音") return "滑动";
    if (selected.category === "集中双元音") return "中滑";
    return "中";
  }, [selected]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const p = MOCK_PHONETICS.find((x) => x.id === id);
    if (p) speak(p.examples[0]?.word || "", 0.7);
  };

  // 按分类分组
  const grouped = useMemo(() => {
    const map: Record<string, typeof MOCK_PHONETICS> = {};
    currentList.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [currentList]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        {/* 标题 */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <Mic2 className="size-4" />
            发音口型图解
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">看清口型，发音更准</h1>
          <p className="mt-2 text-muted-foreground">
            每个音标配口型示意图，帮你找准发音位置
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左侧音标选择 */}
          <aside className="w-full lg:w-72">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3">
                <Tabs
                  defaultValue="vowel"
                  onValueChange={(v) => {
                    setActiveTab(v as "vowel" | "consonant");
                    const first =
                      v === "vowel" ? vowels[0].id : consonants[0].id;
                    setSelectedId(first);
                  }}
                >
                  <TabsList className="mb-3 grid w-full grid-cols-2">
                    <TabsTrigger value="vowel">元音 20</TabsTrigger>
                    <TabsTrigger value="consonant">辅音 28</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
                        {cat}
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {items.map((p) => {
                          const isActive = p.id === selectedId;
                          return (
                            <button
                              key={p.id}
                              onClick={() => handleSelect(p.id)}
                              className={cn(
                                "rounded-lg border py-2 text-center font-mono text-sm font-bold transition-all",
                                isActive
                                  ? "border-primary bg-primary/15 text-primary"
                                  : "border-border/50 bg-background/50 hover:border-primary/40",
                              )}
                            >
                              {p.symbol.replace(/\//g, "")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 右侧详情 */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {selected && features && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* 主卡片 */}
                  <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-emerald-500/10 via-card/80 to-cyan-500/10">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-around">
                        {/* 大号音标 */}
                        <div className="text-center">
                          <Badge variant="outline" className="mb-3">
                            {selected.category}
                          </Badge>
                          <div className="text-7xl font-bold tracking-wider md:text-8xl">
                            {selected.symbol}
                          </div>
                          <button
                            onClick={() =>
                              speak(selected.examples[0]?.word || "", 0.7)
                            }
                            className="mt-4 inline-flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                          >
                            <Volume2 className="size-6" />
                          </button>
                          <p className="mt-2 text-sm text-muted-foreground">
                            点击播放发音
                          </p>
                        </div>

                        {/* 口型图 */}
                        <MouthDiagram
                          openness={features.openness}
                          lipShape={selected.description}
                          voiced={selected.voiced ?? true}
                          isBiting={features.isBiting}
                          isRounded={features.isRounded}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 发音要领 + 舌位 */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                          <CircleDot className="size-4 text-cyan-400" />
                          发音要领
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {selected.description}
                        </p>
                        <div className="mt-3 rounded-lg bg-amber-500/10 p-3">
                          <p className="text-xs text-amber-300">
                            💡 {selected.mnemonic}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50">
                      <CardContent className="p-5">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                          <Circle className="size-4 text-purple-400" />
                          舌位示意
                        </h3>
                        <TongueDiagram position={tonguePosition} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* 清浊音小工具 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold">
                          <Hand className="size-4 text-orange-400" />
                          清浊音小测试
                        </h3>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="vibration"
                            checked={showVibration}
                            onCheckedChange={setShowVibration}
                          />
                          <Label htmlFor="vibration" className="text-xs">
                            显示振动
                          </Label>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                        <div className="flex items-center gap-4">
                          {/* 喉咙示意 */}
                          <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-b from-amber-100 to-amber-200">
                            <div className="absolute bottom-3 left-1/2 h-6 w-8 -translate-x-1/2 rounded-md bg-amber-300/80" />
                            {showVibration && (selected.voiced ?? true) && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.15, 1],
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="absolute bottom-3 left-1/2 h-6 w-8 -translate-x-1/2 rounded-md bg-orange-500/60"
                              />
                            )}
                            <Sparkles
                              className={`absolute -bottom-1 size-5 ${
                                selected.voiced ?? true
                                  ? "text-orange-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>

                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {selected.voiced !== undefined
                                ? selected.voiced
                                  ? "浊辅音 · 声带振动"
                                  : "清辅音 · 声带不振动"
                                : selected.type === "vowel"
                                  ? "元音 · 声带振动"
                                  : ""}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              🤚 手指轻放在喉咙上
                              {selected.voiced !== undefined
                                ? selected.voiced
                                  ? "，发音时能感觉到振动"
                                  : "，只有气流没有振动"
                                : "，感受一下振动"}
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge
                                className={cn(
                                  (selected.voiced ?? true)
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-cyan-500/20 text-cyan-400",
                                )}
                                variant="outline"
                              >
                                {(selected.voiced ?? true) ? "振动 ✓" : "不振动"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        💡 小技巧：清辅音只有气流声（像悄悄话），浊辅音声带会嗡嗡震动。
                        把手放在喉咙上，发 /s/ 和 /z/ 对比试试！
                      </p>
                    </CardContent>
                  </Card>

                  {/* 例词 */}
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-semibold">例词跟读</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selected.examples.map((ex, idx) => (
                          <motion.button
                            key={ex.word}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ x: 4 }}
                            onClick={() => speak(ex.word, 0.8)}
                            className="group flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 text-left transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
                          >
                            <div>
                              <div className="font-semibold group-hover:text-emerald-400">
                                {ex.word}
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                {ex.phonetic}
                              </div>
                            </div>
                            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 opacity-0 transition-all group-hover:opacity-100">
                              <Volume2 className="size-3.5" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
