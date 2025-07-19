import { useState } from "react";
import { Link } from "react-router-dom";
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
  Play,
  Pause,
  ArrowLeft,
  Mic,
  Users,
  Languages,
  Shield,
  Smartphone,
  Award,
} from "lucide-react";

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(1);

  const demoSteps = [
    {
      title: "Voice-First Connection",
      description: "See how Sameer connects with his mentor using just voice",
      icon: Mic,
      duration: "2:30",
    },
    {
      title: "Smart Mentor Matching",
      description: "AI finds the perfect mentor based on language and goals",
      icon: Users,
      duration: "1:45",
    },
    {
      title: "Real-time Translation",
      description: "Cross-language conversations made seamless",
      icon: Languages,
      duration: "2:10",
    },
    {
      title: "Safety & Moderation",
      description: "AI-powered content moderation keeps everyone safe",
      icon: Shield,
      duration: "1:20",
    },
    {
      title: "Mobile Optimization",
      description: "Works perfectly on basic phones with poor internet",
      icon: Smartphone,
      duration: "1:55",
    },
    {
      title: "Progress Tracking",
      description: "Motivational tools and achievement tracking",
      icon: Award,
      duration: "2:00",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                VoiceMentor Demo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Hero */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            See VoiceMentor in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how we're breaking down barriers and connecting rural youth
            with mentors through voice-first technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Demo Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="text-center text-white z-10">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    {isPlaying ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {demoSteps[currentDemo - 1]?.title}
                  </h3>
                  <p className="text-blue-100 mb-4">
                    {demoSteps[currentDemo - 1]?.description}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Demo
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Demo
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      Demo {currentDemo}: {demoSteps[currentDemo - 1]?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Duration: {demoSteps[currentDemo - 1]?.duration}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentDemo(Math.max(1, currentDemo - 1))
                      }
                      disabled={currentDemo === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentDemo(
                          Math.min(demoSteps.length, currentDemo + 1),
                        )
                      }
                      disabled={currentDemo === demoSteps.length}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Navigation */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demo Chapters</CardTitle>
                <CardDescription>Click to jump to any section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {demoSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentDemo(index + 1)}
                      className={`w-full text-left p-3 rounded-lg border transition-all hover:bg-gray-50 ${
                        currentDemo === index + 1
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            currentDemo === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {step.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {step.duration}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h4 className="font-semibold">Ready to get started?</h4>
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link to="/get-started">
                        <Mic className="w-4 h-4 mr-2" />
                        Start Your Journey
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/voice-session">Try Voice Session</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <Card>
          <CardHeader>
            <CardTitle>Success Stories</CardTitle>
            <CardDescription>
              Real stories from our community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  S
                </div>
                <h4 className="font-semibold mb-2">Sameer Kumar</h4>
                <p className="text-sm text-gray-600 mb-3">
                  "Found my coding mentor and built my first app in 6 months!"
                </p>
                <div className="text-xs text-blue-600 font-medium">
                  Web Developer • Maharashtra
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  A
                </div>
                <h4 className="font-semibold mb-2">Anita Sharma</h4>
                <p className="text-sm text-gray-600 mb-3">
                  "Voice sessions in Hindi made learning design so much easier."
                </p>
                <div className="text-xs text-green-600 font-medium">
                  UI/UX Designer • Rajasthan
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  R
                </div>
                <h4 className="font-semibold mb-2">Raj Patel</h4>
                <p className="text-sm text-gray-600 mb-3">
                  "Now I mentor others in Gujarati. Giving back feels amazing!"
                </p>
                <div className="text-xs text-purple-600 font-medium">
                  Senior Developer • Gujarat
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
