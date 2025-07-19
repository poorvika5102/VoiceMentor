import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp, generateId } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Mic, User, MapPin, BookOpen, ArrowLeft } from "lucide-react";

export default function GetStarted() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    language: "",
    interests: "",
    location: "",
  });

  const languages = [
    "Hindi - हिंदी",
    "English",
    "Tamil - தமிழ்",
    "Telugu - తెలుగు",
    "Bengali - বাংলা",
    "Gujarati - ગુજરાતી",
    "Marathi - मराठी",
    "Punjabi - ਪੰਜਾਬੀ",
    "Kannada - ಕನ್ನಡ",
    "Malayalam - മലയാളം",
  ];

  const interests = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Photography",
    "Content Writing",
    "Entrepreneurship",
  ];

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (
        !/^[+]?[0-9\s-()]{10,15}$/.test(formData.phone.replace(/\s/g, ""))
      ) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.role) {
        newErrors.role = "Please select your role";
      }
    }

    if (stepNumber === 2) {
      if (!formData.language) {
        newErrors.language = "Please select your preferred language";
      }
      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
      }
    }

    if (stepNumber === 3) {
      if (!formData.interests) {
        newErrors.interests = "Please select your area of interest";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // Create user object
      const newUser = {
        id: generateId(),
        name: formData.name,
        phone: formData.phone,
        role: formData.role as "mentee" | "mentor" | "both",
        language: formData.language,
        location: formData.location,
        interests: [formData.interests],
        level: "Beginner",
        progress: 0,
        sessions: 0,
        achievements: [],
        joinedDate: new Date().toISOString(),
      };

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save user to context
      dispatch({ type: "SET_USER", payload: newUser });

      // Add welcome notification
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: generateId(),
          title: "Welcome to VoiceMentor!",
          message: `Your profile has been created successfully, ${formData.name}!`,
          type: "success",
          timestamp: new Date().toISOString(),
        },
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: "Failed to create account. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              VoiceMentor
            </span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join VoiceMentor</CardTitle>
            <CardDescription>
              Let's set up your profile in just a few steps
            </CardDescription>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i <= step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Tell us about yourself
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) {
                          setErrors({ ...errors, name: "" });
                        }
                      }}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) {
                          setErrors({ ...errors, phone: "" });
                        }
                      }}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>I want to:</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) => {
                        setFormData({ ...formData, role: value });
                        if (errors.role) {
                          setErrors({ ...errors, role: "" });
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mentee" id="mentee" />
                        <Label htmlFor="mentee">
                          Learn from mentors (Mentee)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mentor" id="mentor" />
                        <Label htmlFor="mentor">
                          Help others learn (Mentor)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both learn and teach</Label>
                      </div>
                    </RadioGroup>
                    {errors.role && (
                      <p className="text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                </div>

                <Button onClick={nextStep} className="w-full">
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Language & Location
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => {
                        setFormData({ ...formData, language: value });
                        if (errors.language) {
                          setErrors({ ...errors, language: "" });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.language && (
                      <p className="text-sm text-red-600">{errors.language}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (State/City)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Maharashtra, Pune"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        if (errors.location) {
                          setErrors({ ...errors, location: "" });
                        }
                      }}
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button onClick={nextStep} className="w-full">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    What interests you?
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select your interests</Label>
                    <Select
                      value={formData.interests}
                      onValueChange={(value) => {
                        setFormData({ ...formData, interests: value });
                        if (errors.interests) {
                          setErrors({ ...errors, interests: "" });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your learning area" />
                      </SelectTrigger>
                      <SelectContent>
                        {interests.map((interest) => (
                          <SelectItem key={interest} value={interest}>
                            {interest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.interests && (
                      <p className="text-sm text-red-600">{errors.interests}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Voice Setup Complete!
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You're all set to start voice conversations with mentors
                      in {formData.language?.split(" - ")[0]}.
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isSubmitting
                      ? "Creating Account..."
                      : "Start Voice Journey"}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
