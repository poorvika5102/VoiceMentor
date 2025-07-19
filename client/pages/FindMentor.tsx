import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Volume2,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Phone,
  Languages,
  MapPin,
  Clock,
  Award,
  Heart,
} from "lucide-react";

export default function FindMentor() {
  const { state, dispatch } = useApp();
  const [localSearchQuery, setLocalSearchQuery] = useState(state.searchQuery);
  const [selectedSkill, setSelectedSkill] = useState(state.selectedSkill);
  const [selectedLanguage, setSelectedLanguage] = useState(
    state.selectedLanguage,
  );
  const [sortBy, setSortBy] = useState<"rating" | "sessions" | "availability">(
    "rating",
  );
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Update global search state with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: localSearchQuery });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_SKILL", payload: selectedSkill });
  }, [selectedSkill, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_LANGUAGE", payload: selectedLanguage });
  }, [selectedLanguage, dispatch]);

  // Get mentors from global state
  const allMentors =
    state.mentors.length > 0
      ? state.mentors
      : [
          {
            id: 1,
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
          },
          {
            id: 2,
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
          },
          {
            id: 3,
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
          },
          {
            id: 4,
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
          },
          {
            id: 5,
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
          },
          {
            id: 6,
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
          },
        ];

  // Memoized filtered and sorted mentors
  const filteredMentors = useMemo(() => {
    let filtered = allMentors.filter((mentor) => {
      const matchesSearch =
        !state.searchQuery ||
        mentor.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        mentor.skill.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        mentor.tags.some((tag) =>
          tag.toLowerCase().includes(state.searchQuery.toLowerCase()),
        );

      const matchesSkill = !selectedSkill || mentor.skill === selectedSkill;
      const matchesLanguage =
        !selectedLanguage || mentor.languages.includes(selectedLanguage);
      const matchesOnlineStatus = !showOnlineOnly || mentor.isOnline;

      return (
        matchesSearch && matchesSkill && matchesLanguage && matchesOnlineStatus
      );
    });

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "sessions":
          return b.sessions - a.sessions;
        case "availability":
          return a.isOnline === b.isOnline ? 0 : a.isOnline ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    allMentors,
    state.searchQuery,
    selectedSkill,
    selectedLanguage,
    showOnlineOnly,
    sortBy,
  ]);

  const skills = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Photography",
  ];

  const languages = [
    "Hindi",
    "English",
    "Telugu",
    "Gujarati",
    "Punjabi",
    "Tamil",
    "Bengali",
    "Marathi",
  ];

  const handleConnectMentor = (mentorId: string) => {
    // Update mentor's online status (simulate connection)
    dispatch({
      type: "UPDATE_MENTOR",
      payload: {
        id: mentorId,
        updates: { isOnline: true },
      },
    });

    // Add notification
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Connecting...",
        message: "Connecting you with your mentor",
        type: "info",
        timestamp: new Date().toISOString(),
      },
    });
  };

  const handleFavoriteMentor = (mentorId: string) => {
    // In a real app, this would save to user favorites
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Added to Favorites",
        message: "Mentor added to your favorites",
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
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Find Mentors
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Your Perfect Mentor</CardTitle>
            <CardDescription>
              Search by skill, language, or mentor name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search mentors, skills, or technologies..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Skills</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Found {filteredMentors.length} mentor
              {filteredMentors.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="online-only"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="online-only" className="text-sm text-gray-600">
                Online only
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="sessions">Most Sessions</SelectItem>
                <SelectItem value="availability">Available Now</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalSearchQuery("");
                setSelectedSkill("");
                setSelectedLanguage("");
                setShowOnlineOnly(false);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 relative">
                    {mentor.isOnline && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`/api/placeholder/48/48?text=${mentor.name.split(" ")[0]}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {mentor.skill}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{mentor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {mentor.sessions} sessions
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span>{mentor.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{mentor.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>{mentor.experience} experience</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {mentor.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {mentor.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{mentor.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm font-semibold text-green-600">
                    {mentor.price}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFavoriteMentor(mentor.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleConnectMentor(mentor.id)}
                      asChild
                    >
                      <Link to="/voice-session">
                        <Phone className="w-4 h-4 mr-2" />
                        {mentor.isOnline ? "Connect" : "Request"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setLocalSearchQuery("");
                  setSelectedSkill("");
                  setSelectedLanguage("");
                  setShowOnlineOnly(false);
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
