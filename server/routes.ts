import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppUserSchema, insertGenerationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertAppUserSchema.parse(req.body);
      
      const existingByEmail = await storage.getAppUserByEmail(validatedData.email);
      if (existingByEmail) {
        return res.json({ user: existingByEmail, isExisting: true });
      }
      
      const existingByMobile = await storage.getAppUserByMobile(validatedData.mobile);
      if (existingByMobile) {
        return res.json({ user: existingByMobile, isExisting: true });
      }
      
      const user = await storage.createAppUser(validatedData);
      return res.status(201).json({ user, isExisting: false });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storage.getAppUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/generations", async (req, res) => {
    try {
      const validatedData = insertGenerationSchema.parse(req.body);
      const generation = await storage.createGeneration(validatedData);
      return res.status(201).json(generation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Generation error:", error);
      return res.status(500).json({ error: "Failed to save generation" });
    }
  });

  app.get("/api/generations", async (req, res) => {
    try {
      const generations = await storage.getAllGenerations();
      return res.json(generations);
    } catch (error) {
      console.error("Get generations error:", error);
      return res.status(500).json({ error: "Failed to get generations" });
    }
  });

  app.get("/api/generations/user/:userId", async (req, res) => {
    try {
      const generations = await storage.getGenerationsByUser(req.params.userId);
      return res.json(generations);
    } catch (error) {
      console.error("Get user generations error:", error);
      return res.status(500).json({ error: "Failed to get user generations" });
    }
  });

  app.get("/api/stats/usage", async (req, res) => {
    try {
      const totalGenerations = await storage.getTotalGenerations();
      return res.json({ totalGenerations });
    } catch (error) {
      console.error("Get usage stats error:", error);
      return res.status(500).json({ error: "Failed to get usage stats" });
    }
  });

  return httpServer;
}
