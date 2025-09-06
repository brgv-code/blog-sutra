import { Feature } from "@/types";
import { Layers, Palette, Bot, Users, Shield, Globe } from "lucide-react";

export const features: Feature[] = [
  {
    icon: Layers,
    title: "Multi-Tab Interface",
    description: "Professional document management with VS Code-like tabs",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "15 Beautiful Themes",
    description: "Stunning themes across 6 categories for every mood",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Bot,
    title: "AI Writing Assistant",
    description: "Smart suggestions and context-aware help",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration with team members",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with SSO and encryption",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Multi-Tenant",
    description: "Custom subdomains for organizations",
    gradient: "from-teal-500 to-green-500",
  },
];
