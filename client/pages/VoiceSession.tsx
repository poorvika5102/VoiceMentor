import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageCircle,
  Star,
  Heart,
  ArrowLeft,
  Languages,
} from "lucide-react";

export default function VoiceSession() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [transcription, setTranscription] = useState([
    {
      speaker: "You",
      text: "नमस्ते, मैं coding स���खना चाहता हूं",
      time: "2:30",
    },
    {
      speaker: "Priya",
      text: "Hello! I'd be happy to help you learn coding. What interests you most?",
      time: "2:32",
    },
    {
      speaker: "You",
      text: "मुझे web development में interest है",
      time: "2:45",
    },
    {
      speaker: "Priya",
      text: "Great! Let's start with HTML basics. I'll explain in Hindi and English.",
      time: "2:47",
    },
  ]);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const mentor = {
    name: "Priya Singh",
    skill: "Web Development",
    rating: 4.9,
    languages: ["Hindi", "English"],
    sessions: 156,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                VoiceMentor
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Mentor Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/api/placeholder/64/64?text=Priya" />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  PS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{mentor.name}</CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                  {mentor.skill}
                </CardDescription>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{mentor.rating}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Languages className="w-3 h-3 mr-1" />
                    {mentor.languages.join(", ")}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">
                  {isConnected ? "Connected" : "Available"}
                </div>
                <div className="text-sm text-gray-600">
                  {isConnected ? formatTime(sessionTime) : "Ready to connect"}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voice Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Voice Controls</CardTitle>
                <CardDescription>
                  Speak naturally, we'll handle the rest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Call Button */}
                <Button
                  size="lg"
                  className={`w-full h-16 text-lg ${
                    isConnected
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={() => setIsConnected(!isConnected)}
                >
                  {isConnected ? (
                    <>
                      <PhoneOff className="w-6 h-6 mr-2" />
                      End Call
                    </>
                  ) : (
                    <>
                      <Phone className="w-6 h-6 mr-2" />
                      Start Call
                    </>
                  )}
                </Button>

                {/* Mute Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12"
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={!isConnected}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Mute
                    </>
                  )}
                </Button>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Auto Translation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time Transcription</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Safe Environment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardHeader>
                <CardTitle>Live Conversation</CardTitle>
                <CardDescription>
                  Real-time transcription with translation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-64 overflow-y-auto">
                  {transcription.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.speaker === "You"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.speaker === "You"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {message.speaker}
                        </div>
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isConnected && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-medium">
                        Listening... Speak naturally
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Rate Session
              </Button>
              <Button variant="outline">Schedule Follow-up</Button>
              <Button variant="outline">Share Progress</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
