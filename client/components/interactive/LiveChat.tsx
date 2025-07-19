import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useInteractive,
  generateChatMessage,
} from "@/contexts/InteractiveContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  MicOff,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Minimize,
  X,
  Volume2,
  Heart,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { VoiceVisualizer, TypingIndicator } from "./AnimatedComponents";

interface LiveChatProps {
  mentorId: string;
  mentorName: string;
  isMinimized?: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function LiveChat({
  mentorId,
  mentorName,
  isMinimized = false,
  onClose,
  onMinimize,
}: LiveChatProps) {
  const { state: interactiveState, dispatch: interactiveDispatch } =
    useInteractive();
  const { state: appState } = useApp();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = interactiveState.chatMessages.filter(
    (msg) =>
      (msg.senderId === mentorId && msg.receiverId === appState.user?.id) ||
      (msg.senderId === appState.user?.id && msg.receiverId === mentorId),
  );

  const isTyping = interactiveState.typingIndicators[mentorId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate mentor responses
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage.senderId === appState.user?.id) {
        // Show typing indicator
        interactiveDispatch({
          type: "SET_TYPING_INDICATOR",
          payload: { userId: mentorId, isTyping: true },
        });

        // Send response after delay
        setTimeout(
          () => {
            interactiveDispatch({
              type: "SET_TYPING_INDICATOR",
              payload: { userId: mentorId, isTyping: false },
            });

            const responses = [
              "That's a great question! Let me explain...",
              "I understand what you're asking. Here's my approach:",
              "Excellent! You're making good progress.",
              "Let me share a quick tip that might help:",
              "I can help you with that. Let's break it down:",
              "Good thinking! Have you considered...",
              "मैं समझ गया। आइए इसे step by step करते हैं।",
              "Perfect! That's exactly the right approach.",
            ];

            const randomResponse =
              responses[Math.floor(Math.random() * responses.length)];

            const mentorMessage = generateChatMessage(
              mentorId,
              mentorName,
              appState.user?.id || "",
              randomResponse,
            );

            interactiveDispatch({
              type: "ADD_CHAT_MESSAGE",
              payload: mentorMessage,
            });
          },
          2000 + Math.random() * 3000,
        );
      }
    }
  }, [
    chatMessages.length,
    mentorId,
    mentorName,
    appState.user?.id,
    interactiveDispatch,
  ]);

  const sendMessage = () => {
    if (!message.trim() || !appState.user) return;

    const newMessage = generateChatMessage(
      appState.user.id,
      appState.user.name,
      mentorId,
      message,
    );

    interactiveDispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: newMessage,
    });

    setMessage("");
  };

  const sendQuickReaction = (emoji: string) => {
    if (!appState.user) return;

    const reactionMessage = generateChatMessage(
      appState.user.id,
      appState.user.name,
      mentorId,
      emoji,
      "emoji",
    );

    interactiveDispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: reactionMessage,
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        if (appState.user) {
          const voiceMessage = generateChatMessage(
            appState.user.id,
            appState.user.name,
            mentorId,
            "🎤 Voice message (0:15)",
            "voice",
          );

          interactiveDispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: voiceMessage,
          });
        }
      }, 3000);
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onMinimize}
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
          {chatMessages.filter(
            (msg) => !msg.isRead && msg.senderId === mentorId,
          ).length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {
                chatMessages.filter(
                  (msg) => !msg.isRead && msg.senderId === mentorId,
                ).length
              }
            </div>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-white/20 text-white">
              {mentorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{mentorName}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs opacity-90">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onMinimize}
          >
            <Minimize className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
        <AnimatePresence>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.senderId === appState.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === appState.user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                } ${msg.type === "emoji" ? "text-2xl py-1" : ""}`}
              >
                {msg.type === "voice" ? (
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">{msg.message}</span>
                    <Button size="sm" variant="ghost" className="p-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 5v10l7-5-7-5z" />
                      </svg>
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-t border-red-200 p-3 flex items-center justify-center space-x-3"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-700 font-medium">Recording...</span>
          <VoiceVisualizer isActive={true} audioLevel={0.7} size="sm" />
        </motion.div>
      )}

      {/* Quick Reactions */}
      <div className="border-t p-2 flex items-center space-x-2">
        {["👍", "❤️", "😊", "🎉", "🔥"].map((emoji) => (
          <Button
            key={emoji}
            size="sm"
            variant="ghost"
            onClick={() => sendQuickReaction(emoji)}
            className="text-lg hover:bg-gray-100"
          >
            {emoji}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-4 flex items-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleRecording}
          className={`${isRecording ? "text-red-500" : "text-gray-500"} hover:bg-gray-100`}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
          disabled={isRecording}
        />

        <Button size="sm" variant="ghost" className="text-gray-500">
          <Smile className="w-4 h-4" />
        </Button>

        <Button size="sm" variant="ghost" className="text-gray-500">
          <Paperclip className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          onClick={sendMessage}
          disabled={!message.trim() || isRecording}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// Chat list for multiple conversations
export function ChatList() {
  const { state: interactiveState, dispatch: interactiveDispatch } =
    useInteractive();
  const { state: appState } = useApp();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Group messages by conversation
  const conversations = useMemo(() => {
    const convMap = new Map();

    interactiveState.chatMessages.forEach((msg) => {
      const partnerId =
        msg.senderId === appState.user?.id ? msg.receiverId : msg.senderId;
      const partnerName =
        msg.senderId === appState.user?.id ? "Mentor" : msg.senderName;

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, {
          id: partnerId,
          name: partnerName,
          messages: [],
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      const conv = convMap.get(partnerId);
      conv.messages.push(msg);
      conv.lastMessage = msg;

      if (!msg.isRead && msg.senderId !== appState.user?.id) {
        conv.unreadCount++;
      }
    });

    return Array.from(convMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime(),
    );
  }, [interactiveState.chatMessages, appState.user?.id]);

  const handleChatSelect = (mentorId: string, mentorName: string) => {
    setActiveChatId(mentorId);
    setIsMinimized(false);

    // Mark messages as read
    interactiveState.chatMessages
      .filter((msg) => msg.senderId === mentorId && !msg.isRead)
      .forEach((msg) => {
        interactiveDispatch({ type: "MARK_MESSAGE_READ", payload: msg.id });
      });
  };

  return (
    <>
      {/* Chat List */}
      {conversations.length > 0 && !activeChatId && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border z-40"
        >
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Messages</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleChatSelect(conv.id, conv.name)}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {conv.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{conv.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.lastMessage.message}
                    </p>
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="bg-red-500">{conv.unreadCount}</Badge>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Chat */}
      {activeChatId && (
        <LiveChat
          mentorId={activeChatId}
          mentorName={
            conversations.find((c) => c.id === activeChatId)?.name || "Mentor"
          }
          isMinimized={isMinimized}
          onClose={() => setActiveChatId(null)}
          onMinimize={() => setIsMinimized(!isMinimized)}
        />
      )}
    </>
  );
}
