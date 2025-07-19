import { RequestHandler } from "express";

interface Mentor {
  id: string;
  name: string;
  skill: string;
  bio: string;
  rating: number;
  sessions: number;
  languages: string[];
  location: string;
  experience: string;
  availability: string;
  tags: string[];
  price: string;
  isOnline: boolean;
}

// Initial mentor data
const mentors: Mentor[] = [
  {
    id: "1",
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
    isOnline: true,
  },
  {
    id: "2",
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
    isOnline: false,
  },
  {
    id: "3",
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
    isOnline: true,
  },
  {
    id: "4",
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
    isOnline: true,
  },
  {
    id: "5",
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
    isOnline: false,
  },
  {
    id: "6",
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
    isOnline: true,
  },
];

export const getAllMentors: RequestHandler = (req, res) => {
  try {
    const { skill, language, online, search } = req.query;

    let filteredMentors = [...mentors];

    // Filter by skill
    if (skill && typeof skill === "string") {
      filteredMentors = filteredMentors.filter((mentor) =>
        mentor.skill.toLowerCase().includes(skill.toLowerCase()),
      );
    }

    // Filter by language
    if (language && typeof language === "string") {
      filteredMentors = filteredMentors.filter((mentor) =>
        mentor.languages.some((lang) =>
          lang.toLowerCase().includes(language.toLowerCase()),
        ),
      );
    }

    // Filter by online status
    if (online === "true") {
      filteredMentors = filteredMentors.filter((mentor) => mentor.isOnline);
    }

    // Search by name, skill, or tags
    if (search && typeof search === "string") {
      const searchTerm = search.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm) ||
          mentor.skill.toLowerCase().includes(searchTerm) ||
          mentor.bio.toLowerCase().includes(searchTerm) ||
          mentor.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    res.json({
      success: true,
      data: filteredMentors,
      count: filteredMentors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getMentor: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const mentor = mentors.find((mentor) => mentor.id === id);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateMentorStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline, availability } = req.body;

    const mentorIndex = mentors.findIndex((mentor) => mentor.id === id);
    if (mentorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Update mentor status
    if (typeof isOnline === "boolean") {
      mentors[mentorIndex].isOnline = isOnline;
    }
    if (availability) {
      mentors[mentorIndex].availability = availability;
    }

    res.json({
      success: true,
      message: "Mentor status updated",
      data: mentors[mentorIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getSkills: RequestHandler = (req, res) => {
  try {
    const skills = [...new Set(mentors.map((mentor) => mentor.skill))];

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getLanguages: RequestHandler = (req, res) => {
  try {
    const allLanguages = mentors.flatMap((mentor) => mentor.languages);
    const uniqueLanguages = [...new Set(allLanguages)];

    res.json({
      success: true,
      data: uniqueLanguages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
