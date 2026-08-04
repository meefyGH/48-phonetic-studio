import { scopedStorage } from "@lark-apaas/client-toolkit-lite";

const PROGRESS_KEY = "phonetics_progress";
const QUIZ_KEY = "phonetics_quiz_best";

export interface IProgressData {
  mastered: string[]; // 已掌握的音标 id 列表
  lastStudyDate: string;
  streak: number;
  totalPractice: number;
}

export interface IQuizBest {
  listen: number; // 听音选音标 最高分
  read: number; // 看音标选单词 最高分
  classify: number; // 分类挑战 最高分
}

const defaultProgress: IProgressData = {
  mastered: [],
  lastStudyDate: "",
  streak: 0,
  totalPractice: 0,
};

const defaultQuizBest: IQuizBest = {
  listen: 0,
  read: 0,
  classify: 0,
};

export function getProgress(): IProgressData {
  try {
    const raw = scopedStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw);
    return { ...defaultProgress, ...parsed };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(data: IProgressData) {
  try {
    scopedStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function toggleMastered(phoneticId: string): IProgressData {
  const p = getProgress();
  const idx = p.mastered.indexOf(phoneticId);
  if (idx >= 0) {
    p.mastered.splice(idx, 1);
  } else {
    p.mastered.push(phoneticId);
  }
  // 更新连续学习天数
  const today = new Date().toISOString().slice(0, 10);
  if (p.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastStudyDate === yesterday ? p.streak + 1 : 1;
    p.lastStudyDate = today;
  }
  saveProgress(p);
  return p;
}

export function getQuizBest(): IQuizBest {
  try {
    const raw = scopedStorage.getItem(QUIZ_KEY);
    if (!raw) return { ...defaultQuizBest };
    const parsed = JSON.parse(raw);
    return { ...defaultQuizBest, ...parsed };
  } catch {
    return { ...defaultQuizBest };
  }
}

export function saveQuizBest(mode: keyof IQuizBest, score: number): IQuizBest {
  const best = getQuizBest();
  if (score > best[mode]) {
    best[mode] = score;
    try {
      scopedStorage.setItem(QUIZ_KEY, JSON.stringify(best));
    } catch {
      // ignore
    }
  }
  return best;
}
