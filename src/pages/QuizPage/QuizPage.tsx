import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Trophy,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Gamepad2,
  ArrowRight,
  Shuffle,
  ListOrdered,
  VolumeX,
} from "lucide-react";
import { MOCK_PHONETICS, type IPhonetic } from "@/data/phonetics";
import { speak } from "@/lib/speech";
import { saveQuizBest, getQuizBest, type IQuizBest } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type QuizMode = "listen" | "read" | "classify";
type QuizState = "menu" | "playing" | "result";

interface IQuestion {
  id: number;
  type: QuizMode;
  correct: string; // 正确答案的音标 id
  options: string[]; // 4 个选项的音标 id
  word?: string; // 听音模式用的单词
  wordPhonetic?: string;
}

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15; // 秒

// 生成随机题目
function generateQuestions(mode: QuizMode, count: number): IQuestion[] {
  const questions: IQuestion[] = [];
  const pool = [...MOCK_PHONETICS];

  for (let i = 0; i < count; i++) {
    // 随机选正确答案
    const correctIdx = Math.floor(Math.random() * pool.length);
    const correct = pool[correctIdx];

    // 生成干扰项 - 优先同类
    const sameCategory = pool.filter(
      (p) => p.category === correct.category && p.id !== correct.id,
    );
    const others = pool.filter((p) => p.id !== correct.id);

    const distractors: IPhonetic[] = [];
    const sc = [...sameCategory].sort(() => Math.random() - 0.5);
    const os = [...others].sort(() => Math.random() - 0.5);

    while (distractors.length < 3 && sc.length > 0) {
      distractors.push(sc.shift()!);
    }
    while (distractors.length < 3 && os.length > 0) {
      const next = os.shift()!;
      if (!distractors.find((d) => d.id === next.id)) {
        distractors.push(next);
      }
    }

    const allOptions = [correct, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((p) => p.id);

    const word =
      correct.examples[Math.floor(Math.random() * correct.examples.length)];

    questions.push({
      id: i,
      type: mode,
      correct: correct.id,
      options: allOptions,
      word: word?.word,
      wordPhonetic: word?.phonetic,
    });
  }

  return questions;
}

const MODES = [
  {
    key: "listen" as const,
    title: "听音选音标",
    desc: "播放单词发音，选出正确的音标",
    icon: Volume2,
    color: "from-cyan-500/20 to-blue-500/10 text-cyan-400",
    border: "border-cyan-500/30",
  },
  {
    key: "read" as const,
    title: "看音标选单词",
    desc: "给出音标，选择对应的单词",
    icon: ListOrdered,
    color: "from-purple-500/20 to-violet-500/10 text-purple-400",
    border: "border-purple-500/30",
  },
  {
    key: "classify" as const,
    title: "分类挑战",
    desc: "判断音标属于元音还是辅音",
    icon: Shuffle,
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-400",
    border: "border-emerald-500/30",
  },
];

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("menu");
  const [mode, setMode] = useState<QuizMode>("listen");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [wrongAnswers, setWrongAnswers] = useState<
    { q: IQuestion; userAnswer: string }[]
  >([]);
  const [bestScores, setBestScores] = useState<IQuizBest>(getQuizBest());

  const currentQ = questions[currentIdx];
  const phoneticMap = useMemo(() => {
    const map: Record<string, IPhonetic> = {};
    MOCK_PHONETICS.forEach((p) => (map[p.id] = p));
    return map;
  }, []);

  // 计时器
  useEffect(() => {
    if (state !== "playing" || answered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, timeLeft, answered]);

  const startQuiz = (m: QuizMode) => {
    setMode(m);
    setQuestions(generateQuestions(m, TOTAL_QUESTIONS));
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(TIME_PER_QUESTION);
    setWrongAnswers([]);
    setState("playing");
  };

  const handleTimeout = useCallback(() => {
    setAnswered(true);
    setSelectedAnswer("");
    if (currentQ) {
      setWrongAnswers((prev) => [...prev, { q: currentQ, userAnswer: "" }]);
    }
  }, [currentQ]);

  const handleAnswer = (answer: string) => {
    if (answered || !currentQ) return;
    setSelectedAnswer(answer);
    setAnswered(true);

    const isCorrect = answer === currentQ.correct;
    if (isCorrect) {
      // 时间奖励：剩余秒数 × 2 分
      const timeBonus = timeLeft * 2;
      setScore((s) => s + 10 + timeBonus);
    } else {
      setWrongAnswers((prev) => [...prev, { q: currentQ, userAnswer: answer }]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx >= questions.length - 1) {
      // 结束
      const finalScore = score;
      const newBest = saveQuizBest(mode, finalScore);
      setBestScores(newBest);
      setState("result");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  const playCurrentSound = () => {
    if (!currentQ) return;
    if (mode === "listen" && currentQ.word) {
      speak(currentQ.word, 0.8);
    } else if (mode === "read") {
      const p = phoneticMap[currentQ.correct];
      speak(p?.examples[0]?.word || "", 0.7);
    }
  };

  // 进入答题自动播放
  useEffect(() => {
    if (state === "playing" && mode === "listen" && currentQ?.word) {
      const t = setTimeout(() => speak(currentQ.word!, 0.8), 300);
      return () => clearTimeout(t);
    }
  }, [state, currentIdx, mode, currentQ?.word]);

  const getOptionLabel = (optId: string, idx: number) => {
    const p = phoneticMap[optId];
    if (!p) return "";
    if (mode === "listen" || mode === "classify") {
      return p.symbol;
    }
    // read 模式：选项是单词
    const word = p.examples[idx % p.examples.length];
    return word?.word || p.symbol;
  };

  // 分类模式的选项是固定的
  const classifyOptions = ["vowel", "consonant"];

  const renderMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Gamepad2 className="size-4" />
          趣味测验
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">选择挑战模式</h1>
        <p className="mt-2 text-muted-foreground">
          三种游戏玩法，边玩边学，看看你能拿多少分！
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map((m, i) => {
          const Icon = m.icon;
          const best = bestScores[m.key];
          return (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => startQuiz(m.key)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-left transition-all hover:shadow-xl",
                m.color,
                m.border,
              )}
            >
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-background/50 backdrop-blur">
                <Icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="size-3.5 text-yellow-500" />
                  最高分：{best}
                </div>
                <ArrowRight className="size-4 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 规则说明 */}
      <Card className="border-border/50 bg-card/30">
        <CardContent className="p-5">
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Sparkles className="size-4 text-yellow-500" />
            游戏规则
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• 每轮 {TOTAL_QUESTIONS} 道题，每题 {TIME_PER_QUESTION} 秒</li>
            <li>• 答对得 10 分，剩余时间 × 2 为时间奖励分</li>
            <li>• 答错或超时不得分，会记入错题回顾</li>
            <li>• 挑战自己的最高分吧！</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPlaying = () => {
    if (!currentQ) return null;
    const correctP = phoneticMap[currentQ.correct];
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timePercent = (timeLeft / TIME_PER_QUESTION) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl space-y-6"
      >
        {/* 顶部状态栏 */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1">
            第 {currentIdx + 1} / {questions.length} 题
          </Badge>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
        </div>

        {/* 进度条 */}
        <Progress value={progress} className="h-1.5" />

        {/* 题目区 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* 倒计时 */}
            <div className="flex items-center justify-center gap-2">
              <Clock
                className={cn(
                  "size-4",
                  timeLeft <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-sm font-mono font-bold",
                  timeLeft <= 5 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  timeLeft <= 5 ? "bg-destructive" : "bg-primary",
                )}
                initial={{ width: "100%" }}
                animate={{ width: `${timePercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* 题目主体 */}
            <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-purple-500/10">
              <CardContent className="p-8 text-center">
                {mode === "listen" && (
                  <>
                    <button
                      onClick={playCurrentSound}
                      className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <Volume2 className="size-10" />
                    </button>
                    <p className="mt-4 text-lg font-medium">听发音，选音标</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      点击喇叭重听一次
                    </p>
                  </>
                )}

                {mode === "read" && correctP && (
                  <>
                    <div className="text-6xl font-bold tracking-wider md:text-7xl">
                      {correctP.symbol}
                    </div>
                    <p className="mt-4 text-lg font-medium">看音标，选单词</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      这个音标出现在哪个单词里？
                    </p>
                  </>
                )}

                {mode === "classify" && correctP && (
                  <>
                    <div className="text-6xl font-bold tracking-wider md:text-7xl">
                      {correctP.symbol}
                    </div>
                    <p className="mt-4 text-lg font-medium">分类挑战</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      这个音标是元音还是辅音？
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 选项 */}
            <div className="grid gap-3 sm:grid-cols-2">
              {(mode === "classify"
                ? classifyOptions.map((opt) => ({ id: opt, label: opt === "vowel" ? "元音 Vowel" : "辅音 Consonant" }))
                : currentQ.options.map((optId, idx) => ({
                    id: optId,
                    label: getOptionLabel(optId, idx),
                  }))
              ).map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                const isCorrect =
                  mode === "classify"
                    ? phoneticMap[currentQ.correct]?.type === opt.id
                    : opt.id === currentQ.correct;
                const showResult = answered;

                let variant = "";
                if (showResult) {
                  if (isCorrect) variant = "correct";
                  else if (isSelected) variant = "wrong";
                } else if (isSelected) {
                  variant = "selected";
                }

                return (
                  <motion.button
                    key={opt.id}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={answered}
                    className={cn(
                      "relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all",
                      variant === "correct" &&
                        "border-success bg-success/10 text-success",
                      variant === "wrong" &&
                        "border-destructive bg-destructive/10 text-destructive",
                      variant === "selected" && "border-primary bg-primary/10",
                      !variant &&
                        "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5",
                      answered && !isCorrect && !isSelected && "opacity-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold md:text-3xl">
                        {opt.label}
                      </span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="ml-auto size-5" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="ml-auto size-5" />
                      )}
                    </div>
                    {mode === "read" && showResult && isCorrect && (
                      <div className="mt-1 font-mono text-xs text-muted-foreground">
                        {phoneticMap[currentQ.correct]?.examples.find(
                          (e) => e.word === opt.label,
                        )?.phonetic || correctP?.examples[0]?.phonetic}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 下一题按钮 */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <Button size="lg" onClick={nextQuestion} className="gap-2">
                  {currentIdx >= questions.length - 1 ? "查看成绩" : "下一题"}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderResult = () => {
    const totalPossible = TOTAL_QUESTIONS * (10 + TIME_PER_QUESTION * 2);
    const percent = Math.round((score / totalPossible) * 100);
    const correctCount = TOTAL_QUESTIONS - wrongAnswers.length;
    const best = bestScores[mode];
    const isNewRecord = score >= best && score > 0;

    let comment = "";
    let emoji = "";
    if (percent >= 90) {
      comment = "太棒了！音标小达人就是你！";
      emoji = "🏆";
    } else if (percent >= 70) {
      comment = "很不错！继续加油！";
      emoji = "⭐";
    } else if (percent >= 50) {
      comment = "还可以，多练习会更好！";
      emoji = "💪";
    } else {
      comment = "别灰心，回去复习一下再来挑战！";
      emoji = "📚";
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl space-y-6 text-center"
      >
        <div className="text-6xl">{emoji}</div>
        <h1 className="text-3xl font-bold md:text-4xl">测验完成！</h1>
        <p className="text-muted-foreground">{comment}</p>

        {isNewRecord && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm font-medium text-yellow-400"
          >
            <Sparkles className="size-4" />
            新纪录！
          </motion.div>
        )}

        {/* 成绩卡 */}
        <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-purple-500/10">
          <CardContent className="p-8">
            <div className="text-6xl font-bold text-primary md:text-7xl">
              {score}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">总得分</div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {correctCount}
                </div>
                <div className="text-xs text-muted-foreground">答对</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {wrongAnswers.length}
                </div>
                <div className="text-xs text-muted-foreground">答错</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{best}</div>
                <div className="text-xs text-muted-foreground">最高分</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错题回顾 */}
        {wrongAnswers.length > 0 && (
          <Card className="border-border/50 bg-card/50 text-left">
            <CardContent className="p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <XCircle className="size-4 text-destructive" />
                错题回顾
              </h3>
              <div className="space-y-2">
                {wrongAnswers.map(({ q, userAnswer }, i) => {
                  const correctP = phoneticMap[q.correct];
                  const userP = userAnswer ? phoneticMap[userAnswer] : null;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            q.word
                              ? speak(q.word, 0.8)
                              : speak(correctP?.examples[0]?.word || "", 0.7)
                          }
                          className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"
                        >
                          <Volume2 className="size-4" />
                        </button>
                        <div>
                          <div className="font-mono text-sm">
                            正确：
                            <span className="text-success">
                              {correctP?.symbol}
                            </span>
                            {mode === "read" && q.word && ` (${q.word})`}
                          </div>
                          {userP && (
                            <div className="font-mono text-xs text-muted-foreground">
                              你选：
                              <span className="text-destructive">
                                {userP.symbol}
                              </span>
                            </div>
                          )}
                          {!userAnswer && (
                            <div className="text-xs text-muted-foreground">
                              超时未答
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => startQuiz(mode)} className="gap-2">
            <RotateCcw className="size-4" />
            再来一局
          </Button>
          <Button variant="secondary" onClick={() => setState("menu")} className="gap-2">
            <Gamepad2 className="size-4" />
            换个模式
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <AnimatePresence mode="wait">
          {state === "menu" && (
            <div key="menu">{renderMenu()}</div>
          )}
          {state === "playing" && (
            <div key="playing">{renderPlaying()}</div>
          )}
          {state === "result" && (
            <div key="result">{renderResult()}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
