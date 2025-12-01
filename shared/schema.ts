import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const appUsers = pgTable("app_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppUserSchema = createInsertSchema(appUsers).pick({
  name: true,
  email: true,
  mobile: true,
});

export type InsertAppUser = z.infer<typeof insertAppUserSchema>;
export type AppUser = typeof appUsers.$inferSelect;

export const generations = pgTable("generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => appUsers.id),
  boardData: jsonb("board_data").notNull(),
  downloadType: text("download_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationSchema = createInsertSchema(generations).pick({
  userId: true,
  boardData: true,
  downloadType: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;

export const usageStats = pgTable("usage_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalGenerations: integer("total_generations").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
