import { RequestHandler } from "express";

interface User {
  id: string;
  name: string;
  phone: string;
  role: "mentee" | "mentor" | "both";
  language: string;
  location: string;
  interests: string[];
  level: string;
  progress: number;
  sessions: number;
  achievements: any[];
  joinedDate: string;
}

// In-memory storage (in production, this would be a database)
const users: User[] = [];

export const createUser: RequestHandler = (req, res) => {
  try {
    const userData: User = req.body;

    // Validate required fields
    if (!userData.name || !userData.phone || !userData.role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, phone, or role",
      });
    }

    // Check if user with phone already exists
    const existingUser = users.find((user) => user.phone === userData.phone);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Add user to storage
    users.push(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };

    res.json({
      success: true,
      message: "User updated successfully",
      data: users[userIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser: RequestHandler = (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = users.find((user) => user.phone === phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this phone number",
      });
    }

    // In a real app, you'd verify OTP here
    // For demo purposes, we'll just return the user
    res.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUsers: RequestHandler = (req, res) => {
  try {
    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
