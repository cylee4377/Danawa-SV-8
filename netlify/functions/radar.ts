import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { v4 as uuidv4 } from "uuid";

type Nation = "domestic" | "export";

interface RadarModel {
  id: string;
  rank: number;
  prevRank: number | null;
  modelName: string;
  manufacturer: string;
  sales: number;
  prevSales: number;
  momAbs: number;
  momPct: number;
  rankChange: number;
  score: number;
  nation: Nation;
  month: string;
  originalUrl: string;
}

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-00`;
}

function generateMockData(nation: Nation, month: string): RadarModel[] {
  const domesticModels = [
    { name: "그랜저", manufacturer: "현대", baseSales: 8500 },
    { name: "아반떼", manufacturer: "현대", baseSales: 7200 },
    { name: "쏘나타", manufacturer: "현대", baseSales: 6800 },
    { name: "투싼", manufacturer: "현대", baseSales: 6200 },
    { name: "싼타페", manufacturer: "현대", baseSales: 5800 },
    { name: "K5", manufacturer: "기아", baseSales: 5500 },
    { name: "쏘렌토", manufacturer: "기아", baseSales: 5200 },
    { name: "K8", manufacturer: "기아", baseSales: 4800 },
    { name: "팰리세이드", manufacturer: "현대", baseSales: 4500 },
    { name: "카니발", manufacturer: "기아", baseSales: 4200 },
    { name: "셀토스", manufacturer: "기아", baseSales: 3900 },
    { name: "스포티지", manufacturer: "기아", baseSales: 3600 },
    { name: "코나", manufacturer: "현대", baseSales: 3300 },
    { name: "아이오닉5", manufacturer: "현대", baseSales: 3100 },
    { name: "EV6", manufacturer: "기아", baseSales: 2900 },
    { name: "G80", manufacturer: "제네시스", baseSales: 2700 },
    { name: "GV70", manufacturer: "제네시스", baseSales: 2500 },
    { name: "GV80", manufacturer: "제네시스", baseSales: 2300 },
    { name: "G70", manufacturer: "제네시스", baseSales: 2100 },
    { name: "베뉴", manufacturer: "현대", baseSales: 1900 },
    { name: "레이", manufacturer: "기아", baseSales: 1700 },
    { name: "모닝", manufacturer: "기아", baseSales: 1500 },
    { name: "스타리아", manufacturer: "현대", baseSales: 1300 },
    { name: "캐스퍼", manufacturer: "현대", baseSales: 1200 },
    { name: "니로", manufacturer: "기아", baseSales: 1100 },
  ];

  const importModels = [
    { name: "E-Class", manufacturer: "벤츠", baseSales: 3200 },
    { name: "5시리즈", manufacturer: "BMW", baseSales: 2900 },
    { name: "A6", manufacturer: "아우디", baseSales: 2100 },
    { name: "Model Y", manufacturer: "테슬라", baseSales: 2800 },
    { name: "Model 3", manufacturer: "테슬라", baseSales: 2400 },
    { name: "GLC", manufacturer: "벤츠", baseSales: 2200 },
    { name: "X3", manufacturer: "BMW", baseSales: 1900 },
    { name: "Q5", manufacturer: "아우디", baseSales: 1600 },
    { name: "C-Class", manufacturer: "벤츠", baseSales: 1800 },
    { name: "3시리즈", manufacturer: "BMW", baseSales: 1700 },
    { name: "A4", manufacturer: "아우디", baseSales: 1400 },
    { name: "GLE", manufacturer: "벤츠", baseSales: 1500 },
    { name: "X5", manufacturer: "BMW", baseSales: 1300 },
    { name: "Q7", manufacturer: "아우디", baseSales: 1100 },
    { name: "S-Class", manufacturer: "벤츠", baseSales: 900 },
    { name: "7시리즈", manufacturer: "BMW", baseSales: 800 },
    { name: "레인지로버", manufacturer: "랜드로버", baseSales: 700 },
    { name: "카이엔", manufacturer: "포르쉐", baseSales: 650 },
    { name: "마칸", manufacturer: "포르쉐", baseSales: 600 },
    { name: "ES", manufacturer: "렉서스", baseSales: 550 },
  ];

  const models = nation === "domestic" ? domesticModels : importModels;
  const rawModels: RadarModel[] = [];

  models.forEach((model, index) => {
    const variationFactor = 0.7 + Math.random() * 0.6;
    const sales = Math.round(model.baseSales * variationFactor);
    const prevSalesVariation = 0.75 + Math.random() * 0.5;
    const prevSales = Math.round(sales * prevSalesVariation);
    const momAbs = sales - prevSales;
    const momPct = prevSales > 0 ? momAbs / prevSales : 0;

    const rankChange = Math.floor(Math.random() * 11) - 5;
    const prevRank = Math.max(1, index + 1 + rankChange);

    const danawaUrl = `https://auto.danawa.com/auto/?Month=${month}&Nation=${nation}&Tab=Model&Work=record`;

    rawModels.push({
      id: uuidv4(),
      rank: index + 1,
      prevRank,
      modelName: model.name,
      manufacturer: model.manufacturer,
      sales,
      prevSales,
      momAbs,
      momPct: Number(momPct.toFixed(3)),
      rankChange: prevRank - (index + 1),
      score: 0,
      nation,
      month,
      originalUrl: danawaUrl,
    });
  });

  const positiveGrowthModels = rawModels.filter((m) => m.momAbs > 0);

  if (positiveGrowthModels.length === 0) {
    return rawModels.map((m, i) => ({ ...m, rank: i + 1, score: 0 }));
  }

  const momAbsValues = positiveGrowthModels.map((m) => m.momAbs);
  const momPctValues = positiveGrowthModels.map((m) => m.momPct);
  const rankChangeValues = positiveGrowthModels.map((m) => m.rankChange);

  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = (arr: number[]) => {
    const m = mean(arr);
    const variance = arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
    return Math.sqrt(variance) || 1;
  };

  const zScore = (value: number, arr: number[]) =>
    (value - mean(arr)) / std(arr);

  const scoredModels = positiveGrowthModels.map((model) => {
    const zMomAbs = zScore(model.momAbs, momAbsValues);
    const zMomPct = zScore(model.momPct, momPctValues);
    const zRankChange = zScore(model.rankChange, rankChangeValues);

    const compositeScore = 0.55 * zMomAbs + 0.35 * zMomPct + 0.1 * zRankChange;

    return { ...model, score: Number(compositeScore.toFixed(4)) };
  });

  scoredModels.sort((a, b) => b.score - a.score);

  return scoredModels.map((model, index) => ({
    ...model,
    rank: index + 1,
  }));
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const params = event.queryStringParameters || {};
    const nation = (params.nation || "domestic") as Nation;
    const month = params.month || getCurrentMonth();

    if (nation !== "domestic" && nation !== "export") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid nation parameter" }),
      };
    }

    const models = generateMockData(nation, month);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        models,
        currentMonth: month,
        lastUpdated: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch radar data" }),
    };
  }
};

export { handler };
