// Facts below are taken from the current bizcraft.co.in pages (home, about,
// factory, clients). Anything not sourced there is phrased as an invitation,
// not a claim — see docs/REDESIGN.md for the list of items to confirm.

export const company = {
  name: "Bizcraft Solutions Pvt. Ltd.",
  founded: 2003,
  phone: "+91-22-26127744",
  phoneHref: "tel:+912226127744",
  email: "info@bizcraft.co.in",
  office: {
    label: "Head office",
    lines: [
      "Office No 1, Ankur, Hanuman Cross Road 2",
      "(Swami Samarth Road), Vile Parle East",
      "Mumbai 400057",
    ],
  },
  factory: {
    label: "Factory",
    lines: [
      "306–312, Third Floor, Building E1A",
      "Asmeeta Textile Park, Kongaon",
      "Bhiwandi, Thane 421311",
    ],
  },
};

export const clients = [
  "UltraTech",
  "Hyundai",
  "Amul",
  "ICICI Bank",
  "State Bank of India",
  "Saint-Gobain",
  "D-Link",
  "Viacom18",
  "Bank of Baroda",
  "Westpac",
  "Future Generali",
  "Wockhardt",
  "IPCA",
  "Phonak",
  "DDB Mudra",
  "Radio City",
  "Kores",
  "Kisna",
  "RBS",
  "Arthveda",
];

export const solutions = [
  {
    code: "S/01",
    title: "Employee kits",
    body: "Onboarding and milestone kits your people will actually carry — backpacks, laptop bags and apparel, branded and packed per employee.",
  },
  {
    code: "S/02",
    title: "Promotional bags",
    body: "Conference, launch and campaign bags that keep your brand in circulation long after the event.",
  },
  {
    code: "S/03",
    title: "OEM for brands",
    body: "Private-label production for bag, luggage and electronics brands — built to your tech pack, finished to your standard.",
  },
  {
    code: "S/04",
    title: "Defence & forces",
    body: "Bags and jackets for the armed forces, police and other services, made to specification.",
  },
];

export const products = [
  { name: "Backpacks", note: "Everyday, laptop and college packs" },
  { name: "Laptop bags", note: "Sleeves, messengers and briefcases" },
  { name: "Travel bags", note: "Cabin, trolley and weekend bags" },
  { name: "Duffle bags", note: "Gym, sport and kit bags" },
  { name: "Hand bags", note: "Totes, slings and utility bags" },
  { name: "Defence bags", note: "Load-bearing bags for armed forces" },
  { name: "Police & forces", note: "Duty bags for police and services" },
  { name: "Jackets", note: "Jackets for defence personnel" },
  { name: "T-shirts & caps", note: "Apparel to complete the kit" },
];

export const factoryFacts = [
  "Latest and imported machines",
  "Cutting department with cutting software",
  "Dedicated QC rooms",
  "In-house R&D and testing centre",
  "Human, fire and hazardous-material safety compliant",
];

export const process = [
  {
    step: "01",
    title: "Brief",
    body: "Tell us the use, quantity, budget and timeline. We suggest constructions and materials that fit.",
  },
  {
    step: "02",
    title: "Sample",
    body: "Our R&D centre builds a physical sample with your branding for sign-off.",
  },
  {
    step: "03",
    title: "Cut & stitch",
    body: "Software-assisted cutting, then production across our machine floor in Bhiwandi.",
  },
  {
    step: "04",
    title: "Check",
    body: "Every batch passes through our QC rooms and testing centre before it is packed.",
  },
  {
    step: "05",
    title: "Deliver",
    body: "Packed in bulk or per employee, and dispatched to your offices.",
  },
];

export const timeline = [
  {
    year: "2003",
    title: "Vaishnavi Enterprises",
    body: "We start out making bags in small quantities.",
  },
  {
    year: "2010",
    title: "Becomes Bizcraft",
    body: "Renamed and grown into a corporate-gifting partner.",
  },
  {
    year: "2016",
    title: "Bizcraft Solutions Pvt. Ltd.",
    body: "Incorporated, and focused on being a dedicated bag manufacturer.",
  },
  {
    year: "Next",
    title: "1,000 machines",
    body: "Scaling the floor to become an OEM partner for leading bag and laptop brands.",
  },
];

export type Swatch = { name: string; hex: string };

export const swatches: Swatch[] = [
  { name: "Chalk", hex: "#ECE9E2" },
  { name: "Graphite", hex: "#3B3E44" },
  { name: "Navy", hex: "#1F3157" },
  { name: "Olive", hex: "#5B6138" },
  { name: "Saffron", hex: "#E8742C" },
  { name: "Maroon", hex: "#6E2430" },
  { name: "Sky", hex: "#8FB3D9" },
  { name: "Forest", hex: "#25483A" },
];
