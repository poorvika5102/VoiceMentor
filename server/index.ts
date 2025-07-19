import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  createUser,
  getUser,
  updateUser,
  loginUser,
  getAllUsers,
} from "./routes/users";
import {
  getAllMentors,
  getMentor,
  updateMentorStatus,
  getSkills,
  getLanguages,
} from "./routes/mentors";
import {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  joinSession,
  endSession,
} from "./routes/sessions";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from VoiceMentor server!" });
  });

  app.get("/api/demo", handleDemo);

  // User routes
  app.post("/api/users", createUser);
  app.get("/api/users", getAllUsers);
  app.get("/api/users/:id", getUser);
  app.put("/api/users/:id", updateUser);
  app.post("/api/auth/login", loginUser);

  // Mentor routes
  app.get("/api/mentors", getAllMentors);
  app.get("/api/mentors/:id", getMentor);
  app.put("/api/mentors/:id/status", updateMentorStatus);
  app.get("/api/skills", getSkills);
  app.get("/api/languages", getLanguages);

  // Session routes
  app.post("/api/sessions", createSession);
  app.get("/api/sessions", getSessions);
  app.get("/api/sessions/:id", getSession);
  app.put("/api/sessions/:id", updateSession);
  app.delete("/api/sessions/:id", deleteSession);
  app.post("/api/sessions/:id/join", joinSession);
  app.post("/api/sessions/:id/end", endSession);

  return app;
}
