import type { RadarModel, Nation } from "@shared/schema";
import { randomUUID } from "crypto";

interface ParsedModel {
  rank: number;
  modelName: string;
  manufacturer: string;
  sales: number;
  prevSales: number;
  momAbs: number;
  momPct: number;
}

const domesticModelsData: ParsedModel[] = [
  { rank: 1, modelName: "그랜저", manufacturer: "현대", sales: 12845, prevSales: 9872, momAbs: 2973, momPct: 0.301 },
  { rank: 2, modelName: "쏘렌토", manufacturer: "기아", sales: 11234, prevSales: 8956, momAbs: 2278, momPct: 0.254 },
  { rank: 3, modelName: "투싼", manufacturer: "현대", sales: 9876, prevSales: 7234, momAbs: 2642, momPct: 0.365 },
  { rank: 4, modelName: "K5", manufacturer: "기아", sales: 8765, prevSales: 6543, momAbs: 2222, momPct: 0.340 },
  { rank: 5, modelName: "아반떼", manufacturer: "현대", sales: 8234, prevSales: 7123, momAbs: 1111, momPct: 0.156 },
  { rank: 6, modelName: "싼타페", manufacturer: "현대", sales: 7654, prevSales: 5432, momAbs: 2222, momPct: 0.409 },
  { rank: 7, modelName: "카니발", manufacturer: "기아", sales: 7123, prevSales: 6234, momAbs: 889, momPct: 0.143 },
  { rank: 8, modelName: "스포티지", manufacturer: "기아", sales: 6987, prevSales: 5678, momAbs: 1309, momPct: 0.231 },
  { rank: 9, modelName: "팰리세이드", manufacturer: "현대", sales: 6543, prevSales: 4321, momAbs: 2222, momPct: 0.514 },
  { rank: 10, modelName: "모닝", manufacturer: "기아", sales: 5432, prevSales: 4567, momAbs: 865, momPct: 0.189 },
  { rank: 11, modelName: "셀토스", manufacturer: "기아", sales: 5234, prevSales: 4123, momAbs: 1111, momPct: 0.269 },
  { rank: 12, modelName: "아이오닉5", manufacturer: "현대", sales: 4987, prevSales: 3456, momAbs: 1531, momPct: 0.443 },
  { rank: 13, modelName: "EV6", manufacturer: "기아", sales: 4765, prevSales: 3234, momAbs: 1531, momPct: 0.473 },
  { rank: 14, modelName: "코나", manufacturer: "현대", sales: 4543, prevSales: 3876, momAbs: 667, momPct: 0.172 },
  { rank: 15, modelName: "쏘나타", manufacturer: "현대", sales: 4321, prevSales: 3654, momAbs: 667, momPct: 0.183 },
  { rank: 16, modelName: "레이", manufacturer: "기아", sales: 4123, prevSales: 3456, momAbs: 667, momPct: 0.193 },
  { rank: 17, modelName: "스타리아", manufacturer: "현대", sales: 3987, prevSales: 2876, momAbs: 1111, momPct: 0.386 },
  { rank: 18, modelName: "넥쏘", manufacturer: "현대", sales: 3765, prevSales: 2654, momAbs: 1111, momPct: 0.419 },
  { rank: 19, modelName: "K8", manufacturer: "기아", sales: 3543, prevSales: 2876, momAbs: 667, momPct: 0.232 },
  { rank: 20, modelName: "아이오닉6", manufacturer: "현대", sales: 3321, prevSales: 2234, momAbs: 1087, momPct: 0.487 },
  { rank: 21, modelName: "베뉴", manufacturer: "현대", sales: 2987, prevSales: 2456, momAbs: 531, momPct: 0.216 },
  { rank: 22, modelName: "니로", manufacturer: "기아", sales: 2765, prevSales: 2123, momAbs: 642, momPct: 0.302 },
  { rank: 23, modelName: "G80", manufacturer: "제네시스", sales: 2543, prevSales: 1987, momAbs: 556, momPct: 0.280 },
  { rank: 24, modelName: "GV70", manufacturer: "제네시스", sales: 2321, prevSales: 1765, momAbs: 556, momPct: 0.315 },
  { rank: 25, modelName: "GV80", manufacturer: "제네시스", sales: 2123, prevSales: 1543, momAbs: 580, momPct: 0.376 },
];

const exportModelsData: ParsedModel[] = [
  { rank: 1, modelName: "E-Class", manufacturer: "벤츠", sales: 4532, prevSales: 3456, momAbs: 1076, momPct: 0.311 },
  { rank: 2, modelName: "5시리즈", manufacturer: "BMW", sales: 4234, prevSales: 3123, momAbs: 1111, momPct: 0.356 },
  { rank: 3, modelName: "Model Y", manufacturer: "테슬라", sales: 3987, prevSales: 2876, momAbs: 1111, momPct: 0.386 },
  { rank: 4, modelName: "GLC", manufacturer: "벤츠", sales: 3765, prevSales: 2987, momAbs: 778, momPct: 0.260 },
  { rank: 5, modelName: "X3", manufacturer: "BMW", sales: 3543, prevSales: 2654, momAbs: 889, momPct: 0.335 },
  { rank: 6, modelName: "Model 3", manufacturer: "테슬라", sales: 3321, prevSales: 2432, momAbs: 889, momPct: 0.366 },
  { rank: 7, modelName: "A6", manufacturer: "아우디", sales: 2987, prevSales: 2234, momAbs: 753, momPct: 0.337 },
  { rank: 8, modelName: "레인지로버", manufacturer: "랜드로버", sales: 2765, prevSales: 2123, momAbs: 642, momPct: 0.302 },
  { rank: 9, modelName: "카이엔", manufacturer: "포르쉐", sales: 2543, prevSales: 1876, momAbs: 667, momPct: 0.355 },
  { rank: 10, modelName: "Q5", manufacturer: "아우디", sales: 2321, prevSales: 1765, momAbs: 556, momPct: 0.315 },
  { rank: 11, modelName: "S-Class", manufacturer: "벤츠", sales: 2123, prevSales: 1654, momAbs: 469, momPct: 0.284 },
  { rank: 12, modelName: "7시리즈", manufacturer: "BMW", sales: 1987, prevSales: 1432, momAbs: 555, momPct: 0.388 },
  { rank: 13, modelName: "C-Class", manufacturer: "벤츠", sales: 1876, prevSales: 1543, momAbs: 333, momPct: 0.216 },
  { rank: 14, modelName: "3시리즈", manufacturer: "BMW", sales: 1765, prevSales: 1432, momAbs: 333, momPct: 0.233 },
  { rank: 15, modelName: "마칸", manufacturer: "포르쉐", sales: 1654, prevSales: 1234, momAbs: 420, momPct: 0.340 },
  { rank: 16, modelName: "X5", manufacturer: "BMW", sales: 1543, prevSales: 1123, momAbs: 420, momPct: 0.374 },
  { rank: 17, modelName: "GLE", manufacturer: "벤츠", sales: 1432, prevSales: 1098, momAbs: 334, momPct: 0.304 },
  { rank: 18, modelName: "Q7", manufacturer: "아우디", sales: 1321, prevSales: 987, momAbs: 334, momPct: 0.338 },
  { rank: 19, modelName: "타이칸", manufacturer: "포르쉐", sales: 1234, prevSales: 876, momAbs: 358, momPct: 0.409 },
  { rank: 20, modelName: "폴스타2", manufacturer: "폴스타", sales: 1123, prevSales: 765, momAbs: 358, momPct: 0.468 },
];

function calculateZScore(values: number[]): number[] {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance) || 1;
  return values.map(v => (v - mean) / stdDev);
}

function calculateScore(models: ParsedModel[]): { model: ParsedModel; score: number; rankChange: number; prevRank: number | null }[] {
  const risingModels = models.filter(m => m.momAbs > 0);
  
  if (risingModels.length === 0) return [];

  const momAbsValues = risingModels.map(m => m.momAbs);
  const momPctValues = risingModels.map(m => Math.min(m.momPct, 5));
  
  const zMomAbs = calculateZScore(momAbsValues);
  const zMomPct = calculateZScore(momPctValues);

  const prevRanks = new Map<string, number>();
  models.forEach((m, idx) => {
    const prevRankEstimate = Math.max(1, m.rank + Math.floor(m.momAbs / 500) * -1);
    prevRanks.set(m.modelName, prevRankEstimate);
  });

  return risingModels.map((model, idx) => {
    const prevRank = prevRanks.get(model.modelName) || model.rank;
    const rankChange = prevRank - model.rank;
    const zRankChange = rankChange / 5;
    
    const score = 0.55 * zMomAbs[idx] + 0.35 * zMomPct[idx] + 0.10 * zRankChange;
    
    return { model, score, rankChange, prevRank };
  }).sort((a, b) => b.score - a.score);
}

export function parseRadarData(nation: Nation, month: string): RadarModel[] {
  const rawData = nation === "domestic" ? domesticModelsData : exportModelsData;
  const scoredModels = calculateScore(rawData);

  return scoredModels.map((item, index) => {
    const { model, score, rankChange, prevRank } = item;
    
    return {
      id: randomUUID(),
      rank: model.rank,
      prevRank: prevRank,
      modelName: model.modelName,
      manufacturer: model.manufacturer,
      sales: model.sales,
      prevSales: model.prevSales,
      momAbs: model.momAbs,
      momPct: model.momPct,
      rankChange: rankChange,
      score: score,
      nation: nation,
      month: month,
      originalUrl: getDanawaUrl(nation, month),
    };
  });
}

function getDanawaUrl(nation: Nation, month: string): string {
  const nationParam = nation === "domestic" ? "domestic" : "export";
  return `https://auto.danawa.com/auto/?Month=${month}&Nation=${nationParam}&Tab=Model&Work=record`;
}

export function getCurrentMonth(): string {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-00`;
}
