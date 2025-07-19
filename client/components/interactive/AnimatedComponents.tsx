import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInteractive } from "@/contexts/InteractiveContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Heart,
  Star,
  Zap,
  Trophy,
  Flame,
  Sparkles,
  Volume2,
  MessageCircle,
  Users,
} from "lucide-react";

// Animated Button with micro-interactions
export function InteractiveButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  asChild,
  ...props
}: any) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  // If asChild is true, return the Button directly without wrapping motion.div
  if (asChild) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
        onClick={handleClick}
        asChild
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      className="relative overflow-hidden"
    >
      <Button
        variant={variant}
        size={size}
        className={`relative ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}

// Animated Progress Bar with celebrations
export function AnimatedProgress({
  value,
  max = 100,
  showCelebration = false,
  className = "",
}: {
  value: number;
  max?: number;
  showCelebration?: boolean;
  className?: string;
}) {
  const [previousValue, setPreviousValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== previousValue) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setPreviousValue(value);
      }, 1000);
    }
  }, [value, previousValue]);

  const percentage = (value / max) * 100;

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative"
          initial={{ width: `${(previousValue / max) * 100}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-white/30"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </div>

      {showCelebration && isAnimating && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -10, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>+{value - previousValue}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Interactive Voice Visualizer
export function VoiceVisualizer({
  isActive,
  audioLevel,
  size = "lg",
}: {
  isActive: boolean;
  audioLevel: number;
  size?: "sm" | "md" | "lg";
}) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setBars(
          Array.from({ length: 12 }, () =>
            audioLevel > 0
              ? Math.random() * audioLevel * 100
              : Math.random() * 20,
          ),
        );
      }, 100);

      return () => clearInterval(interval);
    } else {
      setBars(Array(12).fill(0));
    }
  }, [isActive, audioLevel]);

  const sizeClasses = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-32 h-16",
  };

  return (
    <div
      className={`flex items-end justify-center space-x-1 ${sizeClasses[size]}`}
    >
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className={`bg-gradient-to-t from-blue-500 to-blue-300 rounded-full ${
            size === "sm" ? "w-1" : size === "md" ? "w-1.5" : "w-2"
          }`}
          animate={{
            height: `${Math.max(height, 10)}%`,
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating Action Bubbles
export function FloatingActionBubble({
  icon: Icon,
  onClick,
  color = "blue",
  pulse = false,
}: {
  icon: any;
  onClick: () => void;
  color?: string;
  pulse?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    red: "bg-red-500 hover:bg-red-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <motion.button
      className={`fixed bottom-20 right-6 w-14 h-14 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} text-white rounded-full shadow-lg flex items-center justify-center z-50`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
}

// Animated Notification Toast
export function AnimatedToast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  duration?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    info: "bg-blue-500 border-blue-600",
    success: "bg-green-500 border-green-600",
    error: "bg-red-500 border-red-600",
    warning: "bg-yellow-500 border-yellow-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 max-w-sm p-4 rounded-lg shadow-lg text-white z-50 ${typeStyles[type]}`}
    >
      <p className="font-medium">{message}</p>
    </motion.div>
  );
}

// Interactive Celebration Animation
export function CelebrationAnimation({
  type,
  message,
  onComplete,
}: {
  type: "achievement" | "level_up" | "streak";
  message: string;
  onComplete: () => void;
}) {
  const [confetti, setConfetti] = useState<
    { id: number; x: number; y: number; rotation: number; color: string }[]
  >([]);

  useEffect(() => {
    // Generate confetti
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][
        Math.floor(Math.random() * 5)
      ],
    }));

    setConfetti(newConfetti);

    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getIcon = () => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-16 h-16 text-yellow-500" />;
      case "level_up":
        return <Star className="w-16 h-16 text-purple-500" />;
      case "streak":
        return <Flame className="w-16 h-16 text-orange-500" />;
      default:
        return <Sparkles className="w-16 h-16 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      {/* Confetti */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: piece.color,
            left: piece.x,
          }}
          initial={{ y: piece.y, rotate: piece.rotation }}
          animate={{
            y: window.innerHeight + 100,
            rotate: piece.rotation + 720,
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
        />
      ))}

      {/* Main celebration */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="flex justify-center mb-4"
        >
          {getIcon()}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {type === "achievement" && "Achievement Unlocked!"}
          {type === "level_up" && "Level Up!"}
          {type === "streak" && "Streak Milestone!"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600"
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Interactive Card with hover effects
export function InteractiveCard({
  children,
  className = "",
  onClick,
  ...props
}: any) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      {...props}
    >
      <Card className="relative bg-white hover:shadow-xl transition-shadow duration-300">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent opacity-0 hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
          transition={{ duration: 0.3 }}
        />
        {children}
      </Card>
    </motion.div>
  );
}

// Live Activity Indicator
export function LiveActivityIndicator({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
        animate={
          isActive
            ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={
          isActive ? { duration: 2, repeat: Infinity } : { duration: 0 }
        }
      />
      <span className="text-sm text-gray-600">
        {isActive ? "Live" : "Offline"}
      </span>
    </div>
  );
}

// Typing Indicator
export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 text-gray-500 text-sm">
      <span>Typing</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
