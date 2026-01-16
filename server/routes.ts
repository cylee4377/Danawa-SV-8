import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseRadarData, getCurrentMonth } from "./danawa-parser";
import { nationSchema, radarQuerySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/radar", async (req, res) => {
    try {
      const queryResult = radarQuerySchema.safeParse({
        nation: req.query.nation || "domestic",
        month: req.query.month || undefined,
        minSales: req.query.minSales ? Number(req.query.minSales) : undefined,
        excludeNewEntries: req.query.excludeNewEntries === "true",
      });

      if (!queryResult.success) {
        return res.status(400).json({ 
          error: "Invalid query parameters", 
          details: queryResult.error.flatten() 
        });
      }
      
      const { nation, month } = queryResult.data;
      const monthParam = month || getCurrentMonth();
      
      let radarData = await storage.getRadarData(nation, monthParam);
      
      if (radarData.models.length === 0) {
        const models = parseRadarData(nation, monthParam);
        await storage.saveRadarData(nation, monthParam, models);
        radarData = await storage.getRadarData(nation, monthParam);
      }
      
      res.json(radarData);
    } catch (error) {
      console.error("Error fetching radar data:", error);
      res.status(500).json({ error: "Failed to fetch radar data" });
    }
  });

  app.get("/api/months", async (req, res) => {
    try {
      const months = await storage.getAvailableMonths();
      res.json({ months });
    } catch (error) {
      console.error("Error fetching available months:", error);
      res.status(500).json({ error: "Failed to fetch available months" });
    }
  });

  return httpServer;
}
