import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp, generateId } from "@/contexts/AppContext";
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
import { Progress } from "@/components/ui/progress";
import {
  Volume2,
  ArrowLeft,
  Mic,
  Phone,
  Calendar,
  Award,
  Star,
  BookOpen,
  Users,
  MessageCircle,
  Heart,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  Languages,
  Play,
} from "lucide-react";

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  // Create sample sessions if user exists but has no sessions
  useEffect(() => {
    if (state.user && state.sessions.length === 0) {
      const sampleSessions = [
        {
          id: generateId(),
          mentorId: "1",
          mentorName: "Priya Singh",
          skill: "Web Development",
          scheduledTime: "Today, 3:00 PM",
          duration: 60,
          status: "scheduled" as const,
          type: "voice" as const,
        },
        {
          id: generateId(),
          mentorId: "2",
          mentorName: "Arjun Patel",
          skill: "Mobile Apps",
          scheduledTime: "Tomorrow, 10:00 AM",
          duration: 45,
          status: "scheduled" as const,
          type: "voice" as const,
        },
      ];

      sampleSessions.forEach((session) => {
        dispatch({ type: "ADD_SESSION", payload: session });
      });
    }
  }, [state.user, state.sessions.length, dispatch]);

  // Generate sample achievements if user has none
  useEffect(() => {
    if (state.user && state.user.achievements.length === 0) {
      const sampleAchievements = [
        {
          id: generateId(),
          title: "First Voice Session",
          description: "Completed your first mentorship session",
          icon: "mic",
          color: "blue",
          earnedDate: new Date().toISOString(),
        },
        {
          id: generateId(),
          title: "Profile Complete",
          description: "Set up your complete profile",
          icon: "user",
          color: "green",
          earnedDate: new Date().toISOString(),
        },
      ];

      sampleAchievements.forEach((achievement) => {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: achievement });
      });
    }
  }, [state.user, dispatch]);

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to VoiceMentor
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your dashboard
          </p>
          <Link to="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const upcomingSessions = state.sessions.filter(
    (session) => session.status === "scheduled" || session.status === "ongoing",
  );

  const recentAchievements = state.user.achievements
    .slice(-4)
    .map((achievement) => ({
      title: achievement.title,
      icon:
        achievement.icon === "mic"
          ? Mic
          : achievement.icon === "calendar"
            ? Calendar
            : achievement.icon === "book"
              ? BookOpen
              : Heart,
      color: achievement.color,
    }));

  const suggestedMentors = state.mentors
    .filter(
      (mentor) =>
        mentor.isOnline &&
        mentor.languages.includes(state.user.language.split(" - ")[0]) &&
        state.user.interests.some((interest) =>
          mentor.skill.includes(interest),
        ),
    )
    .slice(0, 2);

  const handleStartSession = (mentorId: string) => {
    setSelectedMentor(mentorId);
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: generateId(),
        title: "Session Starting",
        message: "Connecting you with your mentor...",
        type: "info",
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleProgressUpdate = () => {
    const newProgress = Math.min(state.user.progress + 10, 100);
    dispatch({ type: "UPDATE_PROGRESS", payload: newProgress });

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: generateId(),
        title: "Progress Updated!",
        message: `Great job! You're now at ${newProgress}% completion.`,
        type: "success",
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                VoiceMentor
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
                {state.notifications.length > 0 && (
                  <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1">
                    {state.notifications.length}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {state.user.name}! 👋
              </h1>
              <p className="text-blue-100 mb-4">
                Ready to continue your learning journey in{" "}
                {state.user.interests[0]}?
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Languages className="w-3 h-3 mr-1" />
                  {state.user.language.split(" - ")[0]}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">
                  {state.user.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{state.user.progress}%</div>
              <div className="text-blue-200 text-sm">Progress</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Start your learning session right away
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button size="lg" className="h-16" asChild>
                    <Link to="/voice-session">
                      <Mic className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Start Voice Session</div>
                        <div className="text-xs opacity-80">
                          Connect with mentor
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16" asChild>
                    <Link to="/find-mentor">
                      <Users className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Find New Mentor</div>
                        <div className="text-xs opacity-80">Browse mentors</div>
                      </div>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 sm:col-span-2"
                    onClick={handleProgressUpdate}
                  >
                    <TrendingUp className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Update Progress</div>
                      <div className="text-xs opacity-80">
                        Track your learning
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Your scheduled mentorship sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-600 text-white">
                            {session.mentorName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {session.mentorName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {session.skill}
                          </div>
                          <div className="text-xs text-blue-600">
                            {session.scheduledTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {session.type === "voice"
                            ? "Voice Call"
                            : "Video Call"}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleStartSession(session.mentorId)}
                          asChild
                        >
                          <Link to="/voice-session">
                            <Phone className="w-4 h-4 mr-1" />
                            {session.status === "ongoing" ? "Rejoin" : "Join"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming sessions</p>
                    <p className="text-sm">
                      Book a session with a mentor to get started!
                    </p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/schedule">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New Session
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {state.user.interests[0]}
                    </span>
                    <span className="text-sm text-gray-600">
                      {state.user.progress}%
                    </span>
                  </div>
                  <Progress value={state.user.progress} className="h-2" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {state.user.sessions}
                    </div>
                    <div className="text-sm text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {state.user.achievements.length}
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor(state.user.sessions * 0.75)}h
                    </div>
                    <div className="text-sm text-gray-600">Study Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <div
                          className={`w-8 h-8 bg-${achievement.color}-100 text-${achievement.color}-600 rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {achievement.title}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No achievements yet</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  asChild
                >
                  <Link to="/achievements">
                    <Award className="w-4 h-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Mentors</CardTitle>
                <CardDescription>Based on your interests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedMentors.length > 0 ? (
                  suggestedMentors.map((mentor) => (
                    <div key={mentor.id} className="border rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm">
                            {mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {mentor.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {mentor.skill}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{mentor.rating}</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {mentor.sessions} sessions
                        </span>
                      </div>
                      <Button size="sm" className="w-full" asChild>
                        <Link to="/voice-session">
                          <Mic className="w-3 h-3 mr-1" />
                          Connect
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No suggested mentors</p>
                    <p className="text-xs">Try browsing all mentors</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/courses">
                    <Play className="w-4 h-4 mr-2" />
                    Audio Courses
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/community">
                    <Users className="w-4 h-4 mr-2" />
                    Study Groups
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/questions">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Anonymous
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
