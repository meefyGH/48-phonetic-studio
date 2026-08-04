import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Gamepad2,
  GitCompare,
  Mic2,
  Flame,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import { MOCK_PHONETICS } from "@/data/phonetics";
import { getProgress, type IProgressData } from "@/lib/progress";
import { initSpeech } from "@/lib/speech";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PhoneticCard from "@/components/PhoneticCard";

// 分类颜色映射
const CATEGORY_COLORS: Record<string, string> = {
  前元音: "from-rose-500/20 to-pink-500/10 border-rose-500/30",
  中元音: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  后元音: "from-yellow-500/20 to-lime-500/10 border-yellow-500/30",
  合口双元音: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  集中双元音: "from-cyan-500/20 to-sky-500/10 border-cyan-500/30",
  爆破音: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  摩擦音: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  破擦音: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/30",
  鼻音: "from-orange-500/20 to-red-500/10 border-orange-500/30",
  舌边音: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
  半元音: "from-lime-500/20 to-green-500/10 border-lime-500/30",
};

const VOWEL_CATEGORIES = ["前元音", "中元音", "后元音", "合口双元音", "集中双元音"];
const CONSONANT_CATEGORIES = ["爆破音", "摩擦音", "破擦音", "鼻音", "舌边音", "半元音"];

export default function HomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<IProgressData>(getProgress());

  useEffect(() => {
    initSpeech();
  }, []);

  const totalCount = MOCK_PHONETICS.length;
  const masteredCount = progress.mastered.length;
  const percent = Math.round((masteredCount / totalCount) * 100);

  // 按分类分组
  const grouped = useMemo(() => {
    const map: Record<string, typeof MOCK_PHONETICS> = {};
    MOCK_PHONETICS.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, []);

  // 今日学习建议 - 推荐下一个未掌握的分类
  const suggestion = useMemo(() => {
    const allCats = [...VOWEL_CATEGORIES, ...CONSONANT_CATEGORIES];
    for (const cat of allCats) {
      const items = grouped[cat] || [];
      const unmastered = items.filter((p) => !progress.mastered.includes(p.id));
      if (unmastered.length > 0) {
        return { category: cat, first: unmastered[0], count: unmastered.length };
      }
    }
    return null;
  }, [grouped, progress.mastered]);

  const quickActions = [
    {
      label: "继续学习",
      desc: suggestion ? `${suggestion.category}还剩${suggestion.count}个` : "全部完成啦！",
      icon: BookOpen,
      path: "/learn",
      color: "from-primary/20 to-cyan-500/10 text-primary",
    },
    {
      label: "随机测验",
      desc: "三种模式任你挑战",
      icon: Gamepad2,
      path: "/quiz",
      color: "from-purple-500/20 to-violet-500/10 text-purple-400",
    },
    {
      label: "易混对比",
      desc: "攻克7组易错音标",
      icon: GitCompare,
      path: "/compare",
      color: "from-orange-500/20 to-amber-500/10 text-orange-400",
    },
    {
      label: "口型图解",
      desc: "看清发音位置",
      icon: Mic2,
      path: "/mouth",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="space-y-8 py-8 md:space-y-10 md:py-10">
        {/* Hero 区域 */}
        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card/50 to-purple-500/10 p-6 md:p-10"
            >
              {/* 装饰 */}
              <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-purple-500/20 blur-3xl" />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Zap className="size-3.5" />
                    音标战舰 · 48个国际音标全掌握
                  </div>
                  <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                    你好，少年！
                    <br />
                    准备好征服
                    <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                      48个音标
                    </span>
                    了吗？
                  </h1>
                  <p className="text-sm text-muted-foreground md:text-base">
                    系统学习 + 趣味测验 + 易混对比，用游戏化方式搞定英语发音。
                    每天进步一点点，英语听力口语双提升！
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      onClick={() => navigate("/learn")}
                      className="gap-2 shadow-lg shadow-primary/30"
                    >
                      <BookOpen className="size-4" />
                      开始学习
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => navigate("/quiz")}
                      className="gap-2"
                    >
                      <Gamepad2 className="size-4" />
                      来场测验
                    </Button>
                  </div>
                </div>

                {/* 进度环 */}
                <div className="flex items-center gap-6">
                  <div className="relative flex size-36 flex-col items-center justify-center md:size-44">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="6"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 42 * (1 - percent / 100),
                        }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold md:text-4xl">{percent}%</span>
                      <span className="text-xs text-muted-foreground">
                        {masteredCount}/{totalCount} 已掌握
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 数据统计卡 */}
        <section className="w-full">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-4 md:px-6">
            {[
              {
                label: "已掌握音标",
                value: `${masteredCount}`,
                sub: `共 ${totalCount} 个`,
                icon: Target,
                color: "text-primary",
              },
              {
                label: "连续学习",
                value: `${progress.streak}`,
                sub: "天",
                icon: Flame,
                color: "text-orange-400",
              },
              {
                label: "练习次数",
                value: `${progress.totalPractice}`,
                sub: "次",
                icon: Sparkles,
                color: "text-purple-400",
              },
              {
                label: "最高分",
                value: "0",
                sub: "测验",
                icon: Trophy,
                color: "text-yellow-400",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div
                        className={`flex size-12 items-center justify-center rounded-xl bg-card ${item.color}`}
                      >
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.label} · {item.sub}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 快速入口 */}
        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="mb-4 text-xl font-bold md:text-2xl">快速入口</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(action.path)}
                    className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${action.color} p-5 text-left transition-all hover:shadow-xl`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-semibold">{action.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {action.desc}
                        </div>
                      </div>
                      <div className="flex size-10 items-center justify-center rounded-xl bg-background/50 backdrop-blur">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <ArrowRight className="mt-4 size-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 今日建议 */}
        {suggestion && (
          <section className="w-full">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card/50 to-orange-500/10 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Sparkles className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">今日学习建议</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      推荐学习 <span className="font-medium text-amber-400">{suggestion.category}</span>
                      ，还剩 <span className="font-bold text-amber-400">{suggestion.count}</span> 个音标没掌握。
                      从 <span className="font-mono text-amber-400">{suggestion.first.symbol}</span> 开始吧！
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3 gap-2"
                      onClick={() => navigate("/learn")}
                    >
                      立即学习
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* 音标全家福 */}
        <section className="w-full">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-xl font-bold md:text-2xl">音标全家福</h2>
              <span className="text-sm text-muted-foreground">
                点击任意音标开始学习
              </span>
            </div>

            {/* 元音 */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-400">
                <span className="size-2 rounded-full bg-rose-400" />
                元音 Vowels（20个）
              </h3>
              <div className="space-y-4">
                {VOWEL_CATEGORIES.map((cat) => {
                  const items = grouped[cat] || [];
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        {cat}（{items.length}个）
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {items.map((p) => (
                          <PhoneticCard
                            key={p.id}
                            phonetic={p}
                            size="sm"
                            mastered={progress.mastered.includes(p.id)}
                            onClick={() =>
                              navigate(`/learn?phonetic=${encodeURIComponent(p.id)}`)
                            }
                            colorClass={`bg-gradient-to-br ${CATEGORY_COLORS[cat] || ""}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 辅音 */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-400">
                <span className="size-2 rounded-full bg-violet-400" />
                辅音 Consonants（28个）
              </h3>
              <div className="space-y-4">
                {CONSONANT_CATEGORIES.map((cat) => {
                  const items = grouped[cat] || [];
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        {cat}（{items.length}个）
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {items.map((p) => (
                          <PhoneticCard
                            key={p.id}
                            phonetic={p}
                            size="sm"
                            mastered={progress.mastered.includes(p.id)}
                            onClick={() =>
                              navigate(`/learn?phonetic=${encodeURIComponent(p.id)}`)
                            }
                            colorClass={`bg-gradient-to-br ${CATEGORY_COLORS[cat] || ""}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 底部进度条 */}
        <section className="w-full pb-8">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Card className="border-border/50 bg-card/30">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">总体学习进度</span>
                  <span className="text-primary">{percent}%</span>
                </div>
                <Progress value={percent} className="h-2" />
                <p className="mt-3 text-xs text-muted-foreground">
                  每天学一组（约8个音标），6天就能学完48个国际音标！坚持就是胜利 💪
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
