import React, { createContext, useContext, useReducer, useEffect } from "react";

// Types
export interface User {
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
  achievements: Achievement[];
  avatar?: string;
  joinedDate: string;
}

export interface Mentor {
  id: string;
  name: string;
  skill: string;
  bio: string;
  rating: number;
  sessions: number;
  languages: string[];
  location: string;
  experience: string;
  availability: string;
  tags: string[];
  price: string;
  avatar?: string;
  isOnline: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
}

export interface Session {
  id: string;
  mentorId: string;
  mentorName: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  type: "voice" | "video" | "chat";
  notes?: string;
  rating?: number;
}

export interface VoiceRecording {
  id: string;
  blob: Blob;
  duration: number;
  timestamp: string;
  transcription?: string;
}

// State
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  mentors: Mentor[];
  sessions: Session[];
  voiceRecordings: VoiceRecording[];
  isRecording: boolean;
  searchQuery: string;
  selectedSkill: string;
  selectedLanguage: string;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

// Actions
type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_MENTORS"; payload: Mentor[] }
  | { type: "UPDATE_MENTOR"; payload: { id: string; updates: Partial<Mentor> } }
  | { type: "ADD_SESSION"; payload: Session }
  | {
      type: "UPDATE_SESSION";
      payload: { id: string; updates: Partial<Session> };
    }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "ADD_VOICE_RECORDING"; payload: VoiceRecording }
  | { type: "SET_RECORDING"; payload: boolean }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_SKILL"; payload: string }
  | { type: "SET_SELECTED_LANGUAGE"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ACHIEVEMENT"; payload: Achievement }
  | { type: "UPDATE_PROGRESS"; payload: number };

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: string;
}

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  mentors: [],
  sessions: [],
  voiceRecordings: [],
  isRecording: false,
  searchQuery: "",
  selectedSkill: "",
  selectedLanguage: "",
  notifications: [],
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        sessions: [],
        voiceRecordings: [],
      };

    case "SET_MENTORS":
      return {
        ...state,
        mentors: action.payload,
      };

    case "UPDATE_MENTOR":
      return {
        ...state,
        mentors: state.mentors.map((mentor) =>
          mentor.id === action.payload.id
            ? { ...mentor, ...action.payload.updates }
            : mentor,
        ),
      };

    case "ADD_SESSION":
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      };

    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session,
        ),
      };

    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter(
          (session) => session.id !== action.payload,
        ),
      };

    case "ADD_VOICE_RECORDING":
      return {
        ...state,
        voiceRecordings: [...state.voiceRecordings, action.payload],
      };

    case "SET_RECORDING":
      return {
        ...state,
        isRecording: action.payload,
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    case "SET_SELECTED_SKILL":
      return {
        ...state,
        selectedSkill: action.payload,
      };

    case "SET_SELECTED_LANGUAGE":
      return {
        ...state,
        selectedLanguage: action.payload,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload,
        ),
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "ADD_ACHIEVEMENT":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              achievements: [...state.user.achievements, action.payload],
            }
          : null,
      };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              progress: action.payload,
            }
          : null,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("voicementor_user");
    const savedMentors = localStorage.getItem("voicementor_mentors");
    const savedSessions = localStorage.getItem("voicementor_sessions");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "SET_USER", payload: user });
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }

    if (savedMentors) {
      try {
        const mentors = JSON.parse(savedMentors);
        dispatch({ type: "SET_MENTORS", payload: mentors });
      } catch (error) {
        console.error("Error parsing saved mentors:", error);
      }
    } else {
      // Initialize with default mentors if none saved
      initializeDefaultMentors();
    }

    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        sessions.forEach((session: Session) => {
          dispatch({ type: "ADD_SESSION", payload: session });
        });
      } catch (error) {
        console.error("Error parsing saved sessions:", error);
      }
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("voicementor_user", JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem("voicementor_mentors", JSON.stringify(state.mentors));
  }, [state.mentors]);

  useEffect(() => {
    localStorage.setItem(
      "voicementor_sessions",
      JSON.stringify(state.sessions),
    );
  }, [state.sessions]);

  const initializeDefaultMentors = () => {
    const defaultMentors: Mentor[] = [
      {
        id: "1",
        name: "Priya Singh",
        skill: "Web Development",
        bio: "Full-stack developer helping rural students learn coding in Hindi",
        rating: 4.9,
        sessions: 156,
        languages: ["Hindi", "English"],
        location: "Delhi",
        experience: "5 years",
        availability: "Available now",
        tags: ["HTML", "CSS", "JavaScript", "React"],
        price: "Free",
        isOnline: true,
      },
      {
        id: "2",
        name: "Arjun Patel",
        skill: "Mobile App Development",
        bio: "Android developer passionate about teaching in regional languages",
        rating: 4.8,
        sessions: 203,
        languages: ["Gujarati", "Hindi", "English"],
        location: "Ahmedabad",
        experience: "7 years",
        availability: "Available in 2 hours",
        tags: ["Android", "Flutter", "Kotlin", "Java"],
        price: "₹200/session",
        isOnline: false,
      },
      {
        id: "3",
        name: "Kavya Reddy",
        skill: "Data Science",
        bio: "Data scientist making analytics accessible to everyone",
        rating: 4.9,
        sessions: 98,
        languages: ["Telugu", "English"],
        location: "Hyderabad",
        experience: "4 years",
        availability: "Available tomorrow",
        tags: ["Python", "Machine Learning", "Statistics"],
        price: "₹300/session",
        isOnline: true,
      },
      {
        id: "4",
        name: "Rohit Kumar",
        skill: "UI/UX Design",
        bio: "Design mentor helping students create beautiful user experiences",
        rating: 4.7,
        sessions: 134,
        languages: ["Punjabi", "Hindi", "English"],
        location: "Chandigarh",
        experience: "6 years",
        availability: "Available now",
        tags: ["Figma", "Adobe XD", "User Research", "Prototyping"],
        price: "Free",
        isOnline: true,
      },
      {
        id: "5",
        name: "Anita Sharma",
        skill: "Digital Marketing",
        bio: "Marketing expert teaching online business skills",
        rating: 4.8,
        sessions: 87,
        languages: ["Hindi", "English"],
        location: "Jaipur",
        experience: "3 years",
        availability: "Available in 1 hour",
        tags: ["SEO", "Social Media", "Content Marketing"],
        price: "₹150/session",
        isOnline: false,
      },
      {
        id: "6",
        name: "Vikash Singh",
        skill: "Photography",
        bio: "Professional photographer sharing creative skills",
        rating: 4.6,
        sessions: 76,
        languages: ["Hindi", "Bhojpuri"],
        location: "Patna",
        experience: "8 years",
        availability: "Available now",
        tags: ["Portrait", "Wedding", "Street Photography"],
        price: "₹250/session",
        isOnline: true,
      },
    ];

    dispatch({ type: "SET_MENTORS", payload: defaultMentors });
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function createNotification(
  title: string,
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
): Notification {
  return {
    id: generateId(),
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
  };
}
