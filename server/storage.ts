import type { RadarModel, Nation, RadarResponse } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getRadarData(nation: Nation, month?: string): Promise<RadarResponse>;
  saveRadarData(nation: Nation, month: string, models: RadarModel[]): Promise<void>;
  getAvailableMonths(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private radarCache: Map<string, { models: RadarModel[]; lastUpdated: string }>;
  
  constructor() {
    this.radarCache = new Map();
  }

  private getCacheKey(nation: Nation, month: string): string {
    return `${nation}:${month}`;
  }

  async getRadarData(nation: Nation, month?: string): Promise<RadarResponse> {
    const currentMonth = month || this.getCurrentMonth();
    const key = this.getCacheKey(nation, currentMonth);
    const cached = this.radarCache.get(key);
    
    if (cached) {
      return {
        models: cached.models,
        currentMonth,
        lastUpdated: cached.lastUpdated,
      };
    }

    return {
      models: [],
      currentMonth,
      lastUpdated: new Date().toISOString(),
    };
  }

  async saveRadarData(nation: Nation, month: string, models: RadarModel[]): Promise<void> {
    const key = this.getCacheKey(nation, month);
    this.radarCache.set(key, {
      models,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getAvailableMonths(): Promise<string[]> {
    const months: string[] = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-00`);
    }
    
    return months;
  }

  private getCurrentMonth(): string {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-00`;
  }
}

export const storage = new MemStorage();
