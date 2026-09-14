import {
  Building2,
  Handshake,
  ShieldCheck,
  Sprout,
} from "lucide-react";

export const SETTINGS_STORAGE_KEYS = {
  VERIFICATION: "bf_verification_requests",
  PROFILE: "bf_user_profiles",
};

export const SETTINGS_ROLE_CONFIG = {
  buyer: {
    label: "Buyer",
    title: "Buyer Settings",
    subtitle: "Manage your business account and procurement preferences.",
    icon: Handshake,
    color: "text-blue-600",
    bg: "bg-blue-50",
    profileTitle: "Business Profile",
    profileSubtitle: "Your buyer account information",
  },

  fpo: {
    label: "FPO",
    title: "FPO Settings",
    subtitle: "Manage your FPO account and selling preferences.",
    icon: Building2,
    color: "text-purple-600",
    bg: "bg-purple-50",
    profileTitle: "FPO Profile",
    profileSubtitle: "Your FPO account information",
  },

  admin: {
    label: "Admin",
    title: "Admin Settings",
    subtitle: "Manage administrator account preferences.",
    icon: ShieldCheck,
    color: "text-red-600",
    bg: "bg-red-50",
    profileTitle: "Administrator Profile",
    profileSubtitle: "Your administrator account information",
  },

  farmer: {
    label: "Farmer",
    title: "Farmer Settings",
    subtitle: "Manage your farming account and preferences.",
    icon: Sprout,
    color: "text-green-600",
    bg: "bg-green-50",
    profileTitle: "Farmer Profile",
    profileSubtitle: "Your personal and farming information",
  },
};