import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/contexts/AppContext";
import {
  useInteractive,
  calculatePointsForActivity,
  generateChatMessage,
} from "@/contexts/InteractiveContext";
import { useVoiceRecording, transcribeAudio } from "@/hooks/useVoiceRecording";
import {
  InteractiveButton,
  VoiceVisualizer,
  FloatingActionBubble,
  AnimatedToast,
  InteractiveCard,
  LiveActivityIndicator,
} from "@/components/interactive/AnimatedComponents";
import { ChatList } from "@/components/interactive/LiveChat";
import {
  Mic,
  Users,
  Globe,
  Shield,
  Smartphone,
  Award,
  MessageCircle,
  Heart,
  Star,
  Play,
  Phone,
  Volume2,
  Languages,
  Signal,
  MapPin,
  BookOpen,
  Headphones,
  Sparkles,
  Zap,
  Trophy,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function Index() {
  const { state } = useApp();
  const { state: interactiveState, dispatch: interactiveDispatch } =
    useInteractive();
  const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    error,
    audioLevel,
  } = useVoiceRecording();

  const [activeUsers, setActiveUsers] = useState(1247);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "info" | "success" | "error" | "warning";
  } | null>(null);
  const [pulsingMentors, setPulsingMentors] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize demo chat messages
  useEffect(() => {
    // Add some demo messages after a delay
    const timer = setTimeout(() => {
      const demoMessages = [
        {
          id: "demo-1",
          senderId: "1",
          senderName: "Priya Singh",
          receiverId: "demo-user",
          message:
            "Welcome to VoiceMentor! I'm here to help you start your coding journey. 🚀",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          type: "text" as const,
          isRead: false,
        },
        {
          id: "demo-2",
          senderId: "3",
          senderName: "Kavya Reddy",
          receiverId: "demo-user",
          message:
            "Hi! Looking for help with data science? I'm available for voice sessions in Telugu and English.",
          timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          type: "text" as const,
          isRead: false,
        },
      ];

      demoMessages.forEach((msg) => {
        interactiveDispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: msg,
        });
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [interactiveDispatch]);

  // Animate mentors coming online
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mentorIds = ["1", "2", "3", "4"];
        const randomMentor =
          mentorIds[Math.floor(Math.random() * mentorIds.length)];
        setPulsingMentors((prev) => [...prev, randomMentor]);

        setTimeout(() => {
          setPulsingMentors((prev) => prev.filter((id) => id !== randomMentor));
        }, 3000);

        setShowToast({
          message: "Priya Singh is now available!",
          type: "info",
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        setIsTranscribing(true);
        try {
          const text = await transcribeAudio(blob);
          setTranscription(text);

          // Award points for voice interaction
          interactiveDispatch({
            type: "ADD_POINTS",
            payload: calculatePointsForActivity("voice_recording"),
          });

          setShowToast({
            message: "Voice recorded successfully! +20 points",
            type: "success",
          });
        } catch (err) {
          console.error("Transcription failed:", err);
          setShowToast({
            message: "Voice recording failed. Please try again.",
            type: "error",
          });
        } finally {
          setIsTranscribing(false);
        }
      }
    } else {
      await startRecording();
      setTranscription("");
    }
  };

  const features = [
    {
      icon: Mic,
      title: "Voice Conversations",
      description:
        "Connect with mentors through voice calls and messages in your language",
      color: "voice",
      delay: 0,
    },
    {
      icon: Users,
      title: "Smart Matching",
      description:
        "AI pairs you with mentors based on your interests and goals",
      color: "primary",
      delay: 0.1,
    },
    {
      icon: Languages,
      title: "Cross-Language Support",
      description:
        "Auto-transcribe and translate conversations across languages",
      color: "accent",
      delay: 0.2,
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "AI moderation creates a positive and secure learning space",
      color: "success",
      delay: 0.3,
    },
    {
      icon: Smartphone,
      title: "Works Everywhere",
      description: "Optimized for basic phones and poor internet connections",
      color: "warning",
      delay: 0.4,
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Track milestones and stay motivated with achievements",
      color: "secondary",
      delay: 0.5,
    },
  ];

  const mentors = [
    {
      name: "Priya Singh",
      skill: "Web Development",
      lang: "Hindi",
      rating: 4.9,
      sessions: 156,
      isOnline: true,
      id: "1",
    },
    {
      name: "Arjun Patel",
      skill: "Mobile Apps",
      lang: "Gujarati",
      rating: 4.8,
      sessions: 203,
      isOnline: false,
      id: "2",
    },
    {
      name: "Kavya Reddy",
      skill: "Data Science",
      lang: "Telugu",
      rating: 4.9,
      sessions: 98,
      isOnline: true,
      id: "3",
    },
    {
      name: "Rohit Kumar",
      skill: "UI/UX Design",
      lang: "Punjabi",
      rating: 4.7,
      sessions: 134,
      isOnline: true,
      id: "4",
    },
  ];

  const handleMentorConnect = (mentorName: string) => {
    interactiveDispatch({
      type: "ADD_POINTS",
      payload: calculatePointsForActivity("mentor_connect"),
    });

    setShowToast({
      message: `Connecting with ${mentorName}... +25 points!`,
      type: "success",
    });
  };

  const handleChatOpen = () => {
    // Add a sample message to trigger chat
    const chatMessage = generateChatMessage(
      "1",
      "Priya Singh",
      state.user?.id || "demo-user",
      "Hi! I'm Priya, your coding mentor. How can I help you today? 😊",
    );

    interactiveDispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: chatMessage,
    });

    setShowToast({
      message: "New message from Priya Singh!",
      type: "info",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                VoiceMentor
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <LiveActivityIndicator isActive={true} />
              <Badge variant="outline" className="hidden sm:flex">
                <Signal className="w-3 h-3 mr-1" />
                {activeUsers.toLocaleString()} active users
              </Badge>
              <InteractiveButton variant="outline" asChild>
                <Link to="/sign-in">Sign In</Link>
              </InteractiveButton>
              <InteractiveButton asChild>
                <Link to="/get-started">Get Started</Link>
              </InteractiveButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Breaking barriers through voice
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Learn & Grow with
              <motion.span
                className="text-blue-600"
                animate={{ color: ["#2563eb", "#3b82f6", "#2563eb"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {" "}
                Voice-First
              </motion.span>
              <br />
              Mentorship
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Connect with mentors in your language, no typing required. Built
              for rural India, designed for dreams like Sameer's - where every
              voice matters and every goal is achievable.
            </motion.p>

            {/* Interactive Voice Recording Button */}
            <motion.div
              className="flex flex-col items-center space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={toggleRecording}
                className={`relative w-24 h-24 rounded-full transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-300 overflow-hidden ${
                  isRecording
                    ? "bg-red-500 shadow-lg shadow-red-200"
                    : "bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isRecording
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1, rotate: [0, 5, -5, 0] }
                }
                transition={
                  isRecording
                    ? { duration: 1, repeat: Infinity }
                    : { duration: 4, repeat: Infinity }
                }
              >
                <Mic className="w-10 h-10 text-white mx-auto relative z-10" />

                {isRecording && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-red-300"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-white/30 transition-all duration-150"
                      style={{ height: `${audioLevel * 100}%` }}
                    />
                  </>
                )}

                {!isRecording && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.button>

              <div className="text-center">
                <motion.p
                  className="text-sm text-gray-600 font-medium"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isRecording
                    ? `Recording... ${duration.toFixed(1)}s`
                    : isTranscribing
                      ? "Processing your voice..."
                      : "Tap to speak with a mentor"}
                </motion.p>

                <AnimatePresence>
                  {transcription && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto"
                    >
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        You said:
                      </p>
                      <p className="text-sm text-blue-700">"{transcription}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto"
                    >
                      <p className="text-sm text-red-800">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <VoiceVisualizer
                    isActive={isRecording}
                    audioLevel={audioLevel}
                    size="lg"
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Quick Stats with animations */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {[
              { value: "50K+", label: "Mentorship Sessions", color: "blue" },
              { value: "12", label: "Languages Supported", color: "green" },
              { value: "95%", label: "Success Rate", color: "amber" },
              { value: "2G+", label: "Compatible", color: "purple" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow"
              >
                <motion.div
                  className={`text-2xl font-bold text-${stat.color}-600`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section with interactive cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone, Everywhere
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No matter your device, internet speed, or language - we believe
              everyone deserves access to quality mentorship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                >
                  <InteractiveCard className="h-full">
                    <CardHeader>
                      <motion.div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                          feature.color === "voice"
                            ? "bg-gradient-to-br from-green-400 to-green-500"
                            : feature.color === "primary"
                              ? "bg-gradient-to-br from-blue-400 to-blue-500"
                              : feature.color === "accent"
                                ? "bg-gradient-to-br from-amber-400 to-amber-500"
                                : feature.color === "success"
                                  ? "bg-gradient-to-br from-emerald-400 to-emerald-500"
                                  : feature.color === "warning"
                                    ? "bg-gradient-to-br from-orange-400 to-orange-500"
                                    : "bg-gradient-to-br from-purple-400 to-purple-500"
                        }`}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring" }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </InteractiveCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mentors Section with live status */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Your Future Mentors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with experienced professionals who understand your journey
              and speak your language.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <InteractiveCard>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                              {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <motion.div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              mentor.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                            animate={
                              mentor.isOnline &&
                              pulsingMentors.includes(mentor.id)
                                ? { scale: [1, 1.3, 1] }
                                : { scale: 1 }
                            }
                            transition={{ duration: 0.6, repeat: 3 }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {mentor.name}
                          </CardTitle>
                          <CardDescription className="text-blue-600 font-medium">
                            {mentor.skill}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{mentor.rating}</span>
                      <span className="text-sm text-gray-600">
                        ({mentor.sessions} sessions)
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 w-full justify-center"
                    >
                      <Languages className="w-3 h-3 mr-1" />
                      {mentor.lang}
                    </Badge>
                    <Link to="/voice-session">
                      <InteractiveButton
                        size="sm"
                        className="w-full"
                        onClick={() => handleMentorConnect(mentor.name)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {mentor.isOnline ? "Start Voice Chat" : "Request Chat"}
                      </InteractiveButton>
                    </Link>
                  </CardContent>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  S
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Sameer's Story
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>Rural Maharashtra</span>
                </div>
              </div>
            </div>
            <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
              "I dreamed of coding but felt lost in online groups full of
              English and jargon. With VoiceMentor, I found Priya who speaks
              Hindi and explains everything patiently. Now I'm building my first
              app!"
            </blockquote>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <BookOpen className="w-3 h-3 mr-1" />6 months learning
                </Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Award className="w-3 h-3 mr-1" />
                  First app completed
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [0, 100, 200],
                y: [0, -100, -200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 1.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Voice Matters. Your Dreams Matter.
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of learners breaking barriers and achieving their
            goals through voice-first mentorship.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/voice-session">
              <InteractiveButton
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Start Voice Session
              </InteractiveButton>
            </Link>
            <Link to="/demo">
              <InteractiveButton
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </InteractiveButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VoiceMentor</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering rural youth through voice-first mentorship and
                breaking language barriers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Voice Matching</li>
                <li>Language Support</li>
                <li>Progress Tracking</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Safety Guidelines</li>
                <li>Technical Support</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Languages</h4>
              <ul className="space-y-2 text-gray-400">
                <li>हिंदी (Hindi)</li>
                <li>தமிழ் (Tamil)</li>
                <li>বাংল�� (Bengali)</li>
                <li>ગુજરાતી (Gujarati)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VoiceMentor. Made with ❤️ for rural India.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Bubbles */}
      <FloatingActionBubble
        icon={MessageCircle}
        onClick={handleChatOpen}
        color="blue"
        pulse={true}
      />

      {/* Live Chat System */}
      <ChatList />

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <AnimatedToast
            message={showToast.message}
            type={showToast.type}
            onClose={() => setShowToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
