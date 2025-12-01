import { 
  type AppUser, 
  type InsertAppUser, 
  type Generation, 
  type InsertGeneration,
  appUsers,
  generations,
  usageStats
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getAppUser(id: string): Promise<AppUser | undefined>;
  getAppUserByEmail(email: string): Promise<AppUser | undefined>;
  getAppUserByMobile(mobile: string): Promise<AppUser | undefined>;
  createAppUser(user: InsertAppUser): Promise<AppUser>;
  
  createGeneration(generation: InsertGeneration): Promise<Generation>;
  getGenerationsByUser(userId: string): Promise<Generation[]>;
  getAllGenerations(): Promise<Generation[]>;
  
  getTotalGenerations(): Promise<number>;
  incrementGenerations(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getAppUser(id: string): Promise<AppUser | undefined> {
    const [user] = await db.select().from(appUsers).where(eq(appUsers.id, id));
    return user;
  }

  async getAppUserByEmail(email: string): Promise<AppUser | undefined> {
    const [user] = await db.select().from(appUsers).where(eq(appUsers.email, email));
    return user;
  }

  async getAppUserByMobile(mobile: string): Promise<AppUser | undefined> {
    const [user] = await db.select().from(appUsers).where(eq(appUsers.mobile, mobile));
    return user;
  }

  async createAppUser(insertUser: InsertAppUser): Promise<AppUser> {
    const [user] = await db.insert(appUsers).values(insertUser).returning();
    return user;
  }

  async createGeneration(insertGeneration: InsertGeneration): Promise<Generation> {
    const [generation] = await db.insert(generations).values(insertGeneration).returning();
    await this.incrementGenerations();
    return generation;
  }

  async getGenerationsByUser(userId: string): Promise<Generation[]> {
    return db.select().from(generations).where(eq(generations.userId, userId));
  }

  async getAllGenerations(): Promise<Generation[]> {
    return db.select().from(generations);
  }

  async getTotalGenerations(): Promise<number> {
    const [stats] = await db.select().from(usageStats).limit(1);
    if (!stats) {
      await db.insert(usageStats).values({ totalGenerations: 0 });
      return 0;
    }
    return stats.totalGenerations;
  }

  async incrementGenerations(): Promise<number> {
    const [stats] = await db.select().from(usageStats).limit(1);
    if (!stats) {
      await db.insert(usageStats).values({ totalGenerations: 1 });
      return 1;
    }
    const [updated] = await db
      .update(usageStats)
      .set({ 
        totalGenerations: sql`${usageStats.totalGenerations} + 1`,
        lastUpdated: new Date()
      })
      .where(eq(usageStats.id, stats.id))
      .returning();
    return updated.totalGenerations;
  }
}

export const storage = new DatabaseStorage();
