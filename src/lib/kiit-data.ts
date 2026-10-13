import { CampusLocation, ItemCategory } from "@/types";

export const KIIT_CAMPUSES: CampusLocation[] = [
  {
    id: "campus-15",
    name: "Campus 15 (School of Computer Engineering)",
    category: "ACADEMIC",
    landmark: "Auditorium / Lab Complex B & C",
    description: "Primary hub for B.Tech CSE, IT, and CSSE departments.",
  },
  {
    id: "campus-24",
    name: "Campus 24 (Computer Science Annex)",
    category: "ACADEMIC",
    landmark: "Near KP-7 Gate / Food Court",
    description: "Computing labs, software engineering project wings.",
  },
  {
    id: "campus-3",
    name: "Campus 3 (School of Civil & Mechanical)",
    category: "ACADEMIC",
    landmark: "Workshop Blocks & Heavy Machinery Labs",
    description: "Core engineering branches, central workshop.",
  },
  {
    id: "campus-6",
    name: "Campus 6 (Central Library & Convention Centre)",
    category: "COMMON",
    landmark: "Central Library / Law School Quad",
    description: "Multi-storey central library, large auditoriums.",
  },
  {
    id: "campus-12",
    name: "Campus 12 (School of Management & Electronics)",
    category: "ACADEMIC",
    landmark: "Management Block / Cafeteria",
    description: "KSOM, Electronics & Telecommunication labs.",
  },
  {
    id: "campus-5",
    name: "Campus 5 (School of Electrical Engineering)",
    category: "ACADEMIC",
    landmark: "High Voltage Lab / Solar Research Park",
    description: "Electrical labs and substation research wing.",
  },
  {
    id: "campus-8",
    name: "Campus 8 (Multi-purpose Stadium & Gym)",
    category: "SPORTS",
    landmark: "Indoor Stadium & Cricket Ground",
    description: "Sports complex, swimming pool, basketball courts.",
  },
  {
    id: "ksac",
    name: "KSAC (KIIT Student Activity Centre)",
    category: "COMMON",
    landmark: "Student Clubs & Societies Hub",
    description: "Central meeting point for cultural, tech, and sports societies.",
  },
  {
    id: "kims",
    name: "KIMS & Dental Sciences Campus",
    category: "ACADEMIC",
    landmark: "Hospital & Medical College Gate",
    description: "Medical complex and outpatient department.",
  },
  {
    id: "food-court-chintan",
    name: "Food Court (Chintan / Kathajodi / KP Street)",
    category: "COMMON",
    landmark: "Near KP-6 / KP-7 Dining Avenue",
    description: "Major student dining and evening gathering area.",
  },
  {
    id: "hostel-kp",
    name: "King's Palace (KP-1 to KP-20 Boys Hostels)",
    category: "HOSTEL",
    landmark: "Boys Hostel Complex",
    description: "Student residences for male undergraduates & postgraduates.",
  },
  {
    id: "hostel-qc",
    name: "Queen's Castle (QC-1 to QC-12 Girls Hostels)",
    category: "HOSTEL",
    landmark: "Girls Hostel Complex",
    description: "Student residences for female undergraduates & postgraduates.",
  },
];

export const ITEM_CATEGORIES: {
  id: ItemCategory;
  name: string;
  icon: string;
  description: string;
  sensitive: boolean;
}[] = [
  {
    id: "KIIT_ID_CARD",
    name: "KIIT Smart Card / ID",
    icon: "BadgeAlert",
    description: "Official student or faculty identity cards & lanyards.",
    sensitive: true,
  },
  {
    id: "HOSTEL_KEYS",
    name: "Hostel Key / Keyfob",
    icon: "KeyRound",
    description: "Hostel room keys, biometric tags, cycle lock keys.",
    sensitive: true,
  },
  {
    id: "ELECTRONICS",
    name: "Electronics & Gadgets",
    icon: "Laptop",
    description: "Laptops, Scientific Calculators (fx-991), chargers, AirPods.",
    sensitive: false,
  },
  {
    id: "LAB_COAT_RECORD",
    name: "Lab Coat / Records",
    icon: "BookOpenCheck",
    description: "White aprons, lab manual files, drawing sheets & drafters.",
    sensitive: false,
  },
  {
    id: "CYCLE_ACCESSORY",
    name: "Bicycle / Cycle Gear",
    icon: "Bike",
    description: "Bicycles parked at campus stands, helmets, seat covers.",
    sensitive: false,
  },
  {
    id: "WALLET_DOCS",
    name: "Wallet & Documents",
    icon: "Wallet",
    description: "Wallets, Aadhar/Driving license, bank debit cards.",
    sensitive: true,
  },
  {
    id: "BAGS_BOOKS",
    name: "Backpacks & Textbooks",
    icon: "Backpack",
    description: "College bags, reference textbooks, pouches.",
    sensitive: false,
  },
  {
    id: "OTHER",
    name: "Other Belongings",
    icon: "HelpCircle",
    description: "Watches, spectacles, water bottles, umbrellas.",
    sensitive: false,
  },
];

export const HOSTEL_LIST = [
  "KP-1", "KP-2", "KP-3", "KP-4", "KP-5", "KP-6", "KP-7", "KP-8", "KP-9",
  "KP-10", "KP-11", "KP-12", "KP-14", "KP-15", "KP-16", "KP-17", "KP-18", "KP-19", "KP-20",
  "QC-1", "QC-2", "QC-3", "QC-4", "QC-5", "QC-6", "QC-7", "QC-8", "QC-9",
  "QC-10", "QC-11", "QC-12", "Day Scholar"
];
