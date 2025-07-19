import { RequestHandler } from "express";

interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  userId: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  type: "voice" | "video" | "chat";
  notes?: string;
  rating?: number;
  createdAt: string;
}

// In-memory storage
const sessions: Session[] = [];

export const createSession: RequestHandler = (req, res) => {
  try {
    const sessionData: Session = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    // Validate required fields
    if (
      !sessionData.mentorId ||
      !sessionData.userId ||
      !sessionData.scheduledTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: mentorId, userId, or scheduledTime",
      });
    }

    sessions.push(sessionData);

    res.status(201).json({
      success: true,
      message: "Session scheduled successfully",
      data: sessionData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSessions: RequestHandler = (req, res) => {
  try {
    const { userId, mentorId, status } = req.query;

    let filteredSessions = [...sessions];

    // Filter by user ID
    if (userId && typeof userId === "string") {
      filteredSessions = filteredSessions.filter(
        (session) => session.userId === userId,
      );
    }

    // Filter by mentor ID
    if (mentorId && typeof mentorId === "string") {
      filteredSessions = filteredSessions.filter(
        (session) => session.mentorId === mentorId,
      );
    }

    // Filter by status
    if (status && typeof status === "string") {
      filteredSessions = filteredSessions.filter(
        (session) => session.status === status,
      );
    }

    // Sort by scheduled time
    filteredSessions.sort(
      (a, b) =>
        new Date(a.scheduledTime).getTime() -
        new Date(b.scheduledTime).getTime(),
    );

    res.json({
      success: true,
      data: filteredSessions,
      count: filteredSessions.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const session = sessions.find((session) => session.id === id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sessionIndex = sessions.findIndex((session) => session.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Update session
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };

    res.json({
      success: true,
      message: "Session updated successfully",
      data: sessions[sessionIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const sessionIndex = sessions.findIndex((session) => session.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Remove session
    const deletedSession = sessions.splice(sessionIndex, 1)[0];

    res.json({
      success: true,
      message: "Session deleted successfully",
      data: deletedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const joinSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const sessionIndex = sessions.findIndex((session) => session.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Update session status to ongoing
    sessions[sessionIndex].status = "ongoing";

    res.json({
      success: true,
      message: "Session joined successfully",
      data: sessions[sessionIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const endSession: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, notes } = req.body;

    const sessionIndex = sessions.findIndex((session) => session.id === id);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Update session with completion data
    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      status: "completed",
      rating,
      notes,
    };

    res.json({
      success: true,
      message: "Session completed successfully",
      data: sessions[sessionIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
