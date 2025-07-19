import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useApp } from "./AppContext";

// Types for interactive features
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: "text" | "voice" | "emoji" | "system";
  isRead: boolean;
}

export interface GamificationStats {
  points: number;
  level: number;
  streak: number;
  lastActivityDate: string;
  badges: Badge[];
  dailyGoal: number;
  weeklyGoal: number;
  totalSessionMinutes: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface LiveEvent {
  id: string;
  type:
    | "mentor_online"
    | "session_starting"
    | "achievement_unlocked"
    | "new_message"
    | "streak_milestone";
  title: string;
  description: string;
  timestamp: string;
  data?: any;
}

export interface InteractiveState {
  chatMessages: ChatMessage[];
  gamification: GamificationStats;
  liveEvents: LiveEvent[];
  activeChatId: string | null;
  typingIndicators: { [userId: string]: boolean };
  isVoiceVisualizationActive: boolean;
  currentAudioLevel: number;
  celebrations: Celebration[];
  tutorialStep: number;
  isTutorialActive: boolean;
  mousePosition: { x: number; y: number };
  lastInteraction: string;
}

export interface Celebration {
  id: string;
  type: "achievement" | "level_up" | "streak" | "session_complete";
  title: string;
  message: string;
  duration: number;
  timestamp: string;
}

type InteractiveAction =
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "MARK_MESSAGE_READ"; payload: string }
  | {
      type: "SET_TYPING_INDICATOR";
      payload: { userId: string; isTyping: boolean };
    }
  | { type: "ADD_POINTS"; payload: number }
  | { type: "UPDATE_STREAK"; payload: number }
  | { type: "UNLOCK_BADGE"; payload: Badge }
  | { type: "LEVEL_UP"; payload: number }
  | { type: "ADD_LIVE_EVENT"; payload: LiveEvent }
  | { type: "SET_ACTIVE_CHAT"; payload: string | null }
  | { type: "SET_VOICE_VISUALIZATION"; payload: boolean }
  | { type: "UPDATE_AUDIO_LEVEL"; payload: number }
  | { type: "ADD_CELEBRATION"; payload: Celebration }
  | { type: "REMOVE_CELEBRATION"; payload: string }
  | { type: "SET_TUTORIAL_STEP"; payload: number }
  | { type: "SET_TUTORIAL_ACTIVE"; payload: boolean }
  | { type: "UPDATE_MOUSE_POSITION"; payload: { x: number; y: number } }
  | { type: "UPDATE_LAST_INTERACTION"; payload: string };

const initialState: InteractiveState = {
  chatMessages: [],
  gamification: {
    points: 0,
    level: 1,
    streak: 0,
    lastActivityDate: "",
    badges: [],
    dailyGoal: 30,
    weeklyGoal: 180,
    totalSessionMinutes: 0,
  },
  liveEvents: [],
  activeChatId: null,
  typingIndicators: {},
  isVoiceVisualizationActive: false,
  currentAudioLevel: 0,
  celebrations: [],
  tutorialStep: 0,
  isTutorialActive: false,
  mousePosition: { x: 0, y: 0 },
  lastInteraction: new Date().toISOString(),
};

function interactiveReducer(
  state: InteractiveState,
  action: InteractiveAction,
): InteractiveState {
  switch (action.type) {
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };

    case "MARK_MESSAGE_READ":
      return {
        ...state,
        chatMessages: state.chatMessages.map((msg) =>
          msg.id === action.payload ? { ...msg, isRead: true } : msg,
        ),
      };

    case "SET_TYPING_INDICATOR":
      return {
        ...state,
        typingIndicators: {
          ...state.typingIndicators,
          [action.payload.userId]: action.payload.isTyping,
        },
      };

    case "ADD_POINTS":
      const newPoints = state.gamification.points + action.payload;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      const leveledUp = newLevel > state.gamification.level;

      return {
        ...state,
        gamification: {
          ...state.gamification,
          points: newPoints,
          level: newLevel,
        },
        celebrations: leveledUp
          ? [
              ...state.celebrations,
              {
                id: Date.now().toString(),
                type: "level_up",
                title: "Level Up!",
                message: `You've reached level ${newLevel}!`,
                duration: 3000,
                timestamp: new Date().toISOString(),
              },
            ]
          : state.celebrations,
      };

    case "UPDATE_STREAK":
      const isNewStreak = action.payload > state.gamification.streak;
      return {
        ...state,
        gamification: {
          ...state.gamification,
          streak: action.payload,
          lastActivityDate: new Date().toISOString(),
        },
        celebrations:
          isNewStreak && action.payload % 7 === 0
            ? [
                ...state.celebrations,
                {
                  id: Date.now().toString(),
                  type: "streak",
                  title: "Streak Milestone!",
                  message: `${action.payload} days in a row! 🔥`,
                  duration: 3000,
                  timestamp: new Date().toISOString(),
                },
              ]
            : state.celebrations,
      };

    case "UNLOCK_BADGE":
      return {
        ...state,
        gamification: {
          ...state.gamification,
          badges: [...state.gamification.badges, action.payload],
        },
        celebrations: [
          ...state.celebrations,
          {
            id: Date.now().toString(),
            type: "achievement",
            title: "Badge Unlocked!",
            message: action.payload.name,
            duration: 4000,
            timestamp: new Date().toISOString(),
          },
        ],
      };

    case "ADD_LIVE_EVENT":
      return {
        ...state,
        liveEvents: [action.payload, ...state.liveEvents.slice(0, 9)], // Keep last 10 events
      };

    case "SET_ACTIVE_CHAT":
      return {
        ...state,
        activeChatId: action.payload,
      };

    case "SET_VOICE_VISUALIZATION":
      return {
        ...state,
        isVoiceVisualizationActive: action.payload,
      };

    case "UPDATE_AUDIO_LEVEL":
      return {
        ...state,
        currentAudioLevel: action.payload,
      };

    case "ADD_CELEBRATION":
      return {
        ...state,
        celebrations: [...state.celebrations, action.payload],
      };

    case "REMOVE_CELEBRATION":
      return {
        ...state,
        celebrations: state.celebrations.filter((c) => c.id !== action.payload),
      };

    case "SET_TUTORIAL_STEP":
      return {
        ...state,
        tutorialStep: action.payload,
      };

    case "SET_TUTORIAL_ACTIVE":
      return {
        ...state,
        isTutorialActive: action.payload,
      };

    case "UPDATE_MOUSE_POSITION":
      return {
        ...state,
        mousePosition: action.payload,
      };

    case "UPDATE_LAST_INTERACTION":
      return {
        ...state,
        lastInteraction: action.payload,
      };

    default:
      return state;
  }
}

const InteractiveContext = createContext<{
  state: InteractiveState;
  dispatch: React.Dispatch<InteractiveAction>;
} | null>(null);

export function InteractiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(interactiveReducer, initialState);
  const { state: appState } = useApp();

  // Load saved data
  useEffect(() => {
    const savedGamification = localStorage.getItem("voicementor_gamification");
    if (savedGamification) {
      try {
        const gamification = JSON.parse(savedGamification);
        dispatch({ type: "ADD_POINTS", payload: gamification.points });
        dispatch({ type: "UPDATE_STREAK", payload: gamification.streak });
        gamification.badges.forEach((badge: Badge) => {
          dispatch({ type: "UNLOCK_BADGE", payload: badge });
        });
      } catch (error) {
        console.error("Error loading gamification data:", error);
      }
    }
  }, []);

  // Save gamification data
  useEffect(() => {
    localStorage.setItem(
      "voicementor_gamification",
      JSON.stringify(state.gamification),
    );
  }, [state.gamification]);

  // Auto-remove celebrations
  useEffect(() => {
    state.celebrations.forEach((celebration) => {
      if (celebration.duration > 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_CELEBRATION", payload: celebration.id });
        }, celebration.duration);
      }
    });
  }, [state.celebrations]);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      dispatch({
        type: "UPDATE_MOUSE_POSITION",
        payload: { x: e.clientX, y: e.clientY },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Simulate live events
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const events = [
          {
            type: "mentor_online" as const,
            title: "Mentor Online",
            description: "Priya Singh is now available for sessions",
          },
          {
            type: "session_starting" as const,
            title: "Session Reminder",
            description: "Your session starts in 15 minutes",
          },
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        dispatch({
          type: "ADD_LIVE_EVENT",
          payload: {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            data: {},
            ...randomEvent,
          },
        });
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <InteractiveContext.Provider value={{ state, dispatch }}>
      {children}
    </InteractiveContext.Provider>
  );
}

export function useInteractive() {
  const context = useContext(InteractiveContext);
  if (!context) {
    throw new Error("useInteractive must be used within InteractiveProvider");
  }
  return context;
}

// Utility functions
export function generateChatMessage(
  senderId: string,
  senderName: string,
  receiverId: string,
  message: string,
  type: "text" | "voice" | "emoji" | "system" = "text",
): ChatMessage {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    senderId,
    senderName,
    receiverId,
    message,
    timestamp: new Date().toISOString(),
    type,
    isRead: false,
  };
}

export function calculatePointsForActivity(activityType: string): number {
  const pointsMap: { [key: string]: number } = {
    session_complete: 100,
    message_sent: 5,
    voice_recording: 20,
    profile_complete: 50,
    mentor_connect: 25,
    daily_login: 10,
    streak_maintain: 15,
  };

  return pointsMap[activityType] || 0;
}

export function getBadgeForMilestone(milestone: string): Badge | null {
  const badges: { [key: string]: Badge } = {
    first_session: {
      id: "first_session",
      name: "First Steps",
      description: "Completed your first mentorship session",
      icon: "🎯",
      color: "blue",
      rarity: "common",
      earnedDate: new Date().toISOString(),
    },
    week_streak: {
      id: "week_streak",
      name: "Consistent Learner",
      description: "Maintained a 7-day learning streak",
      icon: "🔥",
      color: "orange",
      rarity: "rare",
      earnedDate: new Date().toISOString(),
    },
    voice_master: {
      id: "voice_master",
      name: "Voice Master",
      description: "Completed 50 voice sessions",
      icon: "🎤",
      color: "purple",
      rarity: "epic",
      earnedDate: new Date().toISOString(),
    },
    mentor_favorite: {
      id: "mentor_favorite",
      name: "Mentor's Favorite",
      description: "Received 5-star rating from 10 mentors",
      icon: "⭐",
      color: "gold",
      rarity: "legendary",
      earnedDate: new Date().toISOString(),
    },
  };

  return badges[milestone] || null;
}
