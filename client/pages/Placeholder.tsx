import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Volume2,
  ArrowLeft,
  Construction,
  Lightbulb,
  MessageCircle,
} from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pathName = location.pathname.slice(1).replace("-", " ");
  const formattedName = pathName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getBackPath = () => {
    // Smart back navigation based on common user flows
    const currentPath = location.pathname;
    if (
      currentPath.includes("schedule") ||
      currentPath.includes("achievements") ||
      currentPath.includes("courses") ||
      currentPath.includes("community") ||
      currentPath.includes("questions")
    ) {
      return "/dashboard";
    }
    return "/";
  };

  const suggestions = [
    {
      title: "Voice Session",
      description: "Start a mentorship session",
      link: "/voice-session",
      icon: MessageCircle,
    },
    {
      title: "Find Mentor",
      description: "Browse available mentors",
      link: "/find-mentor",
      icon: Lightbulb,
    },
    {
      title: "Dashboard",
      description: "Return to your dashboard",
      link: "/dashboard",
      icon: Volume2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={getBackPath()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
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

      <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {formattedName || "Page"} Coming Soon
            </CardTitle>
            <CardDescription className="text-base">
              We're working hard to bring you this feature. In the meantime,
              explore what's already available!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                What you can do now:
              </h4>
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={suggestion.link}>
                      <Icon className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{suggestion.title}</div>
                        <div className="text-xs text-gray-600">
                          {suggestion.description}
                        </div>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-4">
                Have suggestions for this feature? We'd love to hear from you!
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
