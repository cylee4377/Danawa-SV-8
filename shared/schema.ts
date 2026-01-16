import { z } from "zod";

export const nationSchema = z.enum(["domestic", "export"]);
export type Nation = z.infer<typeof nationSchema>;

export const radarModelSchema = z.object({
  id: z.string(),
  rank: z.number(),
  prevRank: z.number().nullable(),
  modelName: z.string(),
  manufacturer: z.string(),
  sales: z.number(),
  prevSales: z.number(),
  momAbs: z.number(),
  momPct: z.number(),
  rankChange: z.number(),
  score: z.number(),
  nation: nationSchema,
  month: z.string(),
  originalUrl: z.string(),
});

export type RadarModel = z.infer<typeof radarModelSchema>;
export type InsertRadarModel = Omit<RadarModel, 'id'>;

export const radarQuerySchema = z.object({
  month: z.string().optional(),
  nation: nationSchema.default("domestic"),
  minSales: z.number().optional(),
  excludeNewEntries: z.boolean().optional(),
});

export type RadarQuery = z.infer<typeof radarQuerySchema>;

export const radarResponseSchema = z.object({
  models: z.array(radarModelSchema),
  currentMonth: z.string(),
  lastUpdated: z.string(),
});

export type RadarResponse = z.infer<typeof radarResponseSchema>;

// Keep existing user schema for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
