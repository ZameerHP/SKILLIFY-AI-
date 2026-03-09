import { motion } from "motion/react";
import { Brain, Sparkles, BookOpen, Layout, Zap, Users } from "lucide-react";

export const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Tools", href: "#tools" },
  { name: "Pricing", href: "#pricing" },
];

export const FEATURES = [
  {
    title: "AI Chapter Explainer",
    description: "Break down complex topics into simple, Gen-Z friendly explanations in seconds.",
    icon: Brain,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Quiz Generator",
    description: "Turn any study material into interactive quizzes to test your knowledge instantly.",
    icon: Zap,
    color: "from-purple-500 to-pink-400",
  },
  {
    title: "Flashcard Builder",
    description: "Automated flashcards created from your notes using smart spaced-repetition.",
    icon: Layout,
    color: "from-emerald-500 to-teal-400",
  },
  {
    title: "Diagram Generator",
    description: "Visual learner? Generate mind maps and diagrams from text descriptions.",
    icon: Sparkles,
    color: "from-orange-500 to-yellow-400",
  },
  {
    title: "PDF Study Analyzer",
    description: "Upload your textbooks and get instant summaries and key takeaways.",
    icon: BookOpen,
    color: "from-indigo-500 to-blue-400",
  },
  {
    title: "AI Doubt Solver",
    description: "Stuck on a problem? Get step-by-step solutions from your virtual teacher.",
    icon: Users,
    color: "from-rose-500 to-red-400",
  },
];

export const TIMELINE_STEPS = [
  {
    title: "Upload Materials",
    description: "Drop your PDFs, notes, or textbook images into Skillify.",
  },
  {
    title: "AI Analysis",
    description: "Our neural network processes and understands every concept.",
  },
  {
    title: "Personalized Learning",
    description: "Get custom explanations and visual aids tailored to your style.",
  },
  {
    title: "Practice & Master",
    description: "Generate quizzes and flashcards to lock in the knowledge.",
  },
  {
    title: "Track Progress",
    description: "Watch your grades climb with detailed analytics and insights.",
  },
];

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for casual learners",
    features: ["5 AI Explanations/mo", "Basic Quiz Generation", "Standard Flashcards", "Community Support"],
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$12",
    description: "For serious students who want to ace it",
    features: ["Unlimited AI Explanations", "Advanced Quiz Generation", "Custom Flashcard Decks", "Priority AI Doubt Solver", "Detailed Analytics"],
    isPopular: true,
  },
  {
    name: "Team",
    price: "$29",
    description: "For study groups and classrooms",
    features: ["Everything in Pro", "Group Study Rooms", "Shared Resource Library", "Admin Dashboard", "API Access"],
    isPopular: false,
  },
];

export const TESTIMONIALS = [
  {
    name: "Alex Chen",
    role: "Computer Science Student",
    text: "Skillify literally saved my finals. The AI Explainer turned a 50-page chapter into a 5-minute read.",
    image: "https://picsum.photos/seed/alex/100/100",
  },
  {
    name: "Sarah Jenkins",
    role: "Medical Student",
    text: "The Flashcard Builder is a game changer. It creates cards that actually make sense for my anatomy exams.",
    image: "https://picsum.photos/seed/sarah/100/100",
  },
  {
    name: "Marcus Thorne",
    role: "High School Senior",
    text: "I used to hate studying. Now it feels like a game. The UI is so clean and the AI is actually smart.",
    image: "https://picsum.photos/seed/marcus/100/100",
  },
];
