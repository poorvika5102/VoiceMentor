import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useInteractive,
  calculatePointsForActivity,
  getBadgeForMilestone,
} from "@/contexts/InteractiveContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Flame,
  Zap,
  Target,
  Award,
  Sparkles,
  Calendar,
  TrendingUp,
  Gift,
  Crown,
  Gem,
  Medal,
  Timer,
} from "lucide-react";
import { AnimatedProgress, CelebrationAnimation } from "./AnimatedComponents";

// Points Display with animated counter
export function PointsDisplay() {
  const { state } = useInteractive();
  const [displayPoints, setDisplayPoints] = useState(state.gamification.points);

  useEffect(() => {
    if (displayPoints !== state.gamification.points) {
      const duration = 1000;
      const steps = 30;
      const increment = (state.gamification.points - displayPoints) / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setDisplayPoints((prev) => {
          const newValue = prev + increment;
          if (currentStep >= steps) {
            clearInterval(timer);
            return state.gamification.points;
          }
          return newValue;
        });
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [state.gamification.points, displayPoints]);

  const pointsToNextLevel =
    state.gamification.level * 1000 - state.gamification.points;
  const progressToNextLevel = ((state.gamification.points % 1000) / 1000) * 100;

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(displayPoints).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="text-lg font-semibold text-yellow-600">
                Level {state.gamification.level}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {pointsToNextLevel} points to next level
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {state.gamification.level + 1}</span>
            <span>{Math.round(progressToNextLevel)}%</span>
          </div>
          <AnimatedProgress
            value={progressToNextLevel}
            showCelebration={true}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Streak Counter with fire animation
export function StreakCounter() {
  const { state } = useInteractive();
  const [flames, setFlames] = useState<number[]>([]);

  useEffect(() => {
    if (state.gamification.streak > 0) {
      const flameCount = Math.min(state.gamification.streak, 10);
      setFlames(Array.from({ length: flameCount }, (_, i) => i));
    }
  }, [state.gamification.streak]);

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your learning streak today!";
    if (streak < 3) return "Great start! Keep it going!";
    if (streak < 7) return "You're on fire! 🔥";
    if (streak < 14) return "Incredible dedication!";
    if (streak < 30) return "Unstoppable force!";
    return "Legendary learner! 🏆";
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="relative"
              animate={
                state.gamification.streak > 0
                  ? { scale: [1, 1.1, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-8 h-8 text-orange-500" />
              {state.gamification.streak > 0 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  {state.gamification.streak}
                </motion.div>
              )}
            </motion.div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {state.gamification.streak} Day Streak
              </p>
              <p className="text-sm text-gray-600">
                {getStreakMessage(state.gamification.streak)}
              </p>
            </div>
          </div>
        </div>

        {/* Flame visualization */}
        <div className="flex items-end justify-center space-x-1 h-8 mb-4">
          {flames.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-400 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${20 + Math.random() * 20}px` }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Keep learning daily to maintain your streak!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Badge Collection
export function BadgeCollection() {
  const { state } = useInteractive();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-500",
    epic: "from-purple-400 to-purple-500",
    legendary: "from-yellow-400 to-orange-500",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span>Badge Collection</span>
          <Badge variant="secondary">{state.gamification.badges.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {state.gamification.badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedBadge(badge)}
              className="cursor-pointer"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${
                  rarityColors[badge.rarity]
                } rounded-lg flex items-center justify-center text-2xl shadow-lg`}
              >
                {badge.icon}
              </div>
              <p className="text-xs text-center mt-1 truncate">{badge.name}</p>
            </motion.div>
          ))}

          {/* Locked badges */}
          {Array.from({
            length: Math.max(0, 12 - state.gamification.badges.length),
          }).map((_, index) => (
            <div
              key={`locked-${index}`}
              className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center opacity-50"
            >
              <Medal className="w-6 h-6 text-gray-400" />
            </div>
          ))}
        </div>

        {state.gamification.badges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start learning to earn your first badge!</p>
          </div>
        )}
      </CardContent>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${
                  rarityColors[selectedBadge.rarity]
                } rounded-xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}
              >
                {selectedBadge.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
              <Badge
                className={`bg-gradient-to-r ${rarityColors[selectedBadge.rarity]} text-white border-0`}
              >
                {selectedBadge.rarity.toUpperCase()}
              </Badge>
              <p className="text-xs text-gray-500 mt-2">
                Earned on{" "}
                {new Date(selectedBadge.earnedDate).toLocaleDateString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Daily Challenges
export function DailyChallenges() {
  const { state, dispatch } = useInteractive();
  const { state: appState } = useApp();
  const [challenges, setChallenges] = useState([
    {
      id: "voice_session",
      title: "Voice Session",
      description: "Complete a 15-minute voice session",
      points: 50,
      progress: 0,
      target: 1,
      icon: "🎤",
      completed: false,
    },
    {
      id: "send_messages",
      title: "Active Learner",
      description: "Send 10 messages to mentors",
      points: 30,
      progress: 0,
      target: 10,
      icon: "💬",
      completed: false,
    },
    {
      id: "practice_streak",
      title: "Consistency",
      description: "Maintain your learning streak",
      points: 25,
      progress: state.gamification.streak > 0 ? 1 : 0,
      target: 1,
      icon: "🔥",
      completed: state.gamification.streak > 0,
    },
  ]);

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge && !challenge.completed) {
      dispatch({ type: "ADD_POINTS", payload: challenge.points });

      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challengeId
            ? { ...c, completed: true, progress: c.target }
            : c,
        ),
      );

      // Add celebration
      dispatch({
        type: "ADD_CELEBRATION",
        payload: {
          id: Date.now().toString(),
          type: "achievement",
          title: "Challenge Complete!",
          message: `+${challenge.points} points earned!`,
          duration: 3000,
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span>Daily Challenges</span>
          <Timer className="w-4 h-4 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            layout
            className={`p-4 rounded-lg border ${
              challenge.completed
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{challenge.icon}</span>
                <div>
                  <h4 className="font-semibold text-sm">{challenge.title}</h4>
                  <p className="text-xs text-gray-600">
                    {challenge.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  className={`${
                    challenge.completed ? "bg-green-500" : "bg-blue-500"
                  } text-white`}
                >
                  +{challenge.points}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Progress
                  value={(challenge.progress / challenge.target) * 100}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {challenge.progress}/{challenge.target}
                </p>
              </div>

              {challenge.completed ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-semibold">Complete!</span>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => completeChallenge(challenge.id)}
                  disabled={challenge.progress < challenge.target}
                >
                  Claim
                </Button>
              )}
            </div>
          </motion.div>
        ))}

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            Challenges reset daily at midnight
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Leaderboard
export function Leaderboard() {
  const { state } = useInteractive();
  const [leaderboardData] = useState([
    { name: "You", points: state.gamification.points, rank: 1, isUser: true },
    { name: "Arjun Patel", points: 4250, rank: 2, isUser: false },
    { name: "Priya Singh", points: 3890, rank: 3, isUser: false },
    { name: "Kavya Reddy", points: 3650, rank: 4, isUser: false },
    { name: "Rohit Kumar", points: 3200, rank: 5, isUser: false },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span>Leaderboard</span>
          <Badge variant="outline">Weekly</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isUser ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1
                      ? "bg-yellow-500 text-white"
                      : user.rank === 2
                        ? "bg-gray-400 text-white"
                        : user.rank === 3
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {user.rank <= 3
                    ? user.rank === 1
                      ? "🥇"
                      : user.rank === 2
                        ? "🥈"
                        : "🥉"
                    : user.rank}
                </div>
                <div>
                  <p
                    className={`font-semibold ${user.isUser ? "text-blue-700" : ""}`}
                  >
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user.points.toLocaleString()} points
                  </p>
                </div>
              </div>

              {user.rank === 1 && <Crown className="w-5 h-5 text-yellow-500" />}
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-4 border-t mt-4">
          <Button variant="outline" size="sm">
            View Full Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Gamification Dashboard
export function GamificationDashboard() {
  const { state } = useInteractive();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <PointsDisplay />
        <StreakCounter />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <BadgeCollection />
        <DailyChallenges />
        <Leaderboard />
      </div>

      {/* Celebrations */}
      <AnimatePresence>
        {state.celebrations.map((celebration) => (
          <CelebrationAnimation
            key={celebration.id}
            type={celebration.type as any}
            message={celebration.message}
            onComplete={() => {}}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
