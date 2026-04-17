export const siteConfig = {
  name: "Apex-Line Studios",
  shortName: "Apex-Line",
  tagline: "...Where Excellence Stands",
  description:
    "Lagos-based architecture, construction and interior design firm. Over fifteen years shaping Nigeria's skyline with disciplined craft and uncompromising excellence.",
  url: "https://apexline-studios.web.app",
  founded: 2009,
  founder: "Arc. Sumaila Onimisi Yusuf",
  location: "Lagos, Nigeria",
  contact: {
    email: "studio@apexlinestudios.com",
    phone: "+234 800 000 0000",
    address: "Victoria Island, Lagos, Nigeria",
    hours: "Mon-Fri  09:00 - 18:00 WAT",
  },
  social: {
    instagram: "https://instagram.com/apexlinestudios",
    linkedin: "https://linkedin.com/company/apexlinestudios",
    behance: "https://behance.net/apexlinestudios",
  },
};

export const navLinks = [
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "Studio" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    slug: "architectural-design",
    title: "Architectural Design",
    summary: "Master planning, concept design, and detailed drawings for residential, commercial and institutional projects.",
    icon: "Compass",
    deliverables: ["Concept studies", "Schematic & design development", "Construction documents", "BIM coordination"],
  },
  {
    slug: "construction-management",
    title: "Construction Management",
    summary: "End-to-end supervision from foundation to handover with uncompromising quality control.",
    icon: "HardHat",
    deliverables: ["Site supervision", "Subcontractor coordination", "Schedule & budget control", "Quality assurance"],
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    summary: "Refined, human-centred interiors that balance beauty, function and material integrity.",
    icon: "Sofa",
    deliverables: ["Space planning", "Material & finishes specs", "Custom furniture design", "FF&E procurement"],
  },
  {
    slug: "exterior-landscape",
    title: "Exterior & Landscape",
    summary: "Facades, courtyards and landscapes designed to elevate arrival and shape memory.",
    icon: "Trees",
    deliverables: ["Facade engineering", "Landscape design", "External finishes", "Lighting & hardscape"],
  },
  {
    slug: "renovation-remodelling",
    title: "Renovation & Remodelling",
    summary: "Restoring, upgrading and reimagining existing buildings to modern standards.",
    icon: "Hammer",
    deliverables: ["Condition surveys", "Structural upgrades", "Heritage refurbishment", "Full fit-out"],
  },
  {
    slug: "project-consultancy",
    title: "Project Consultancy",
    summary: "Strategic advisory for clients navigating complex developments from feasibility to delivery.",
    icon: "FileText",
    deliverables: ["Feasibility studies", "Cost planning", "Regulatory & compliance", "Owner's representation"],
  },
];

export const processSteps = [
  { number: "01", title: "Discover", body: "We listen, survey, and interrogate the brief until the site's constraints and the client's ambition align." },
  { number: "02", title: "Concept", body: "Sketch-led explorations define a clear architectural idea that will anchor every downstream decision." },
  { number: "03", title: "Design", body: "Schematic and detailed design resolves form, material and experience at every scale." },
  { number: "04", title: "Document", body: "Construction-ready drawings, specifications and BIM models coordinate all consultants." },
  { number: "05", title: "Build", body: "Direct site leadership ensures craft, safety, schedule and cost are held to standard daily." },
  { number: "06", title: "Handover", body: "Commissioning, snagging and aftercare until the building performs exactly as designed." },
];

export const stats = [
  { value: "15+", label: "Years of practice" },
  { value: "150+", label: "Projects delivered" },
  { value: "40+", label: "Institutional clients" },
  { value: "100%", label: "Owner satisfaction" },
];

export const projects = [
  {
    slug: "access-bank-annex",
    name: "Access Bank Annex",
    sector: "Commercial / Banking",
    year: 2019,
    location: "Adeola Odekule, Victoria Island, Lagos",
    client: "Horatio Limited",
    scope: "Roofing, internal & external plaster, fine finishes and tiling",
    cover: "/projects/access-bank-annex/01.jpg",
    gallery: ["/projects/access-bank-annex/01.jpg", "/projects/access-bank-annex/02.jpg", "/projects/access-bank-annex/03.jpg", "/projects/access-bank-annex/04.jpg"],
    brief: "A comprehensive remodelling of the former Access Bank head office annex, restoring institutional presence while upgrading the envelope, roofing and finishes to a modern commercial standard.",
    featured: true,
  },
  {
    slug: "ed-marina",
    name: "ED Marina",
    sector: "Commercial / Heritage Upgrade",
    year: 2020,
    location: "Marina Street, Lagos Island",
    client: "Private",
    scope: "Total upgrade, expansion and complete reskin",
    cover: "/projects/ed-marina/01.jpg",
    gallery: ["/projects/ed-marina/01.jpg", "/projects/ed-marina/02.jpg"],
    brief: "A storied Marina Street building reborn with a new identity — an expansion and envelope reskin that restores its civic stature on one of Lagos Island's most prominent streets.",
    featured: true,
  },
  {
    slug: "george-hotel-annex",
    name: "George Hotel Annex",
    sector: "Hospitality",
    year: 2021,
    location: "Ikoyi, Lagos Island",
    client: "Private",
    scope: "Vertical extension — ground to two floors, full finishing",
    cover: "/projects/george-hotel-annex/01.jpg",
    gallery: ["/projects/george-hotel-annex/01.jpg", "/projects/george-hotel-annex/02.jpg"],
    brief: "A ground-floor building extended vertically into a refined two-storey hospitality annex, completed to finish level with quietly luxurious guest-facing detail.",
    featured: true,
  },
  {
    slug: "duchess-hospital",
    name: "Duchess Hospital",
    sector: "Healthcare",
    year: 2022,
    location: "GRA, Ikeja, Lagos",
    client: "Duchess International",
    scope: "Internal/external plaster, floor tiling, external alucobond finishes",
    cover: "/projects/duchess-hospital/01.jpg",
    gallery: ["/projects/duchess-hospital/01.jpg", "/projects/duchess-hospital/02.jpg"],
    brief: "A contemporary healthcare facility in Ikeja GRA clad in precision alucobond, signalling the clinical rigour and modernity of the institution inside.",
    featured: false,
  },
  {
    slug: "comdale-place",
    name: "Comdale Place",
    sector: "Residential / Mixed-Use",
    year: 2023,
    location: "Abisogun Street, Oniru, Victoria Island",
    client: "Private Developer",
    scope: "Foundation to finishes — end-to-end construction",
    cover: "/projects/comdale-place/01.png",
    gallery: ["/projects/comdale-place/01.png", "/projects/comdale-place/02.jpg"],
    brief: "A complete foundation-to-finishes build in Oniru, combining disciplined detailing with the confident geometry of modern Lagos Island residential.",
    featured: true,
  },
  {
    slug: "chevron-housing",
    name: "Chevron Housing Project",
    sector: "Residential / Estate",
    year: 2023,
    location: "Twin Lakes Estate, Chevron Drive, VI",
    client: "Estate Developer",
    scope: "Roofing, plaster, finishes and tiling at estate scale",
    cover: "/projects/chevron-housing/01.jpg",
    gallery: ["/projects/chevron-housing/01.jpg", "/projects/chevron-housing/02.jpg", "/projects/chevron-housing/03.jpg", "/projects/chevron-housing/04.jpg"],
    brief: "Estate-scale delivery across multiple duplex units in Twin Lakes Estate, executed with consistency of finish and repeatable quality systems.",
    featured: true,
  },
  {
    slug: "shell-fmh-upgrade",
    name: "FMH 16NO Upgrade — Shell",
    sector: "Corporate / Facilities",
    year: 2024,
    location: "Broad Street, Marina, Lagos Island",
    client: "Shell Nigeria",
    scope: "Total upgrade — civil, mechanical & electrical rebuild to world-class standard",
    cover: "/projects/shell-fmh-upgrade/01.png",
    gallery: [
      "/projects/shell-fmh-upgrade/01.png",
      "/projects/shell-fmh-upgrade/02.jpg",
      "/projects/shell-fmh-upgrade/03.jpg",
      "/projects/shell-fmh-upgrade/04.jpg",
      "/projects/shell-fmh-upgrade/05.jpg",
      "/projects/shell-fmh-upgrade/06.jpg",
      "/projects/shell-fmh-upgrade/07.jpg",
      "/projects/shell-fmh-upgrade/08.jpg",
      "/projects/shell-fmh-upgrade/09.jpg",
      "/projects/shell-fmh-upgrade/10.jpg",
    ],
    brief: "A full strip-out and rebuild of sixteen facility floors for Shell at Marina — every civil, mechanical and electrical element taken to new, world-class operating standards.",
    featured: true,
  },
  {
    slug: "marion-apartment",
    name: "Marion Apartment",
    sector: "Luxury Residential",
    year: 2025,
    location: "Lagos",
    client: "Private",
    scope: "Full interior renovation, courtyard works, flats A5 & B5",
    cover: "/projects/marion-apartment/01.jpg",
    gallery: [
      "/projects/marion-apartment/01.jpg",
      "/projects/marion-apartment/02.jpg",
      "/projects/marion-apartment/03.jpg",
      "/projects/marion-apartment/04.jpg",
      "/projects/marion-apartment/05.jpg",
      "/projects/marion-apartment/06.png",
      "/projects/marion-apartment/07.jpg",
    ],
    brief: "Luxury residential renovation across two flats with a shared courtyard — a study in restrained material palette, soft light and considered proportion.",
    featured: false,
  },
];

export type ProjectRecord = (typeof projects)[number];

export const testimonials = [
  {
    quote:
      "Apex-Line delivered a standard of finish and discipline on site we had previously only seen from international firms. Our project handover was on time and on budget.",
    author: "Facilities Lead",
    role: "Shell Nigeria — FMH Upgrade",
  },
  {
    quote:
      "From concept to completion, the team treated the building as theirs. The result speaks for itself every morning we walk into the lobby.",
    author: "Operations Director",
    role: "Horatio Limited",
  },
  {
    quote:
      "Rigorous, calm, and unafraid of complexity. They turned a difficult heritage facade into one of the most photographed buildings on Marina.",
    author: "Owner",
    role: "ED Marina Development",
  },
];

export const clientMarquee = [
  "Shell", "Chevron", "Access Bank", "Horatio Ltd", "Duchess Hospital",
  "George Hotel", "BUA Estate", "Oniru", "Twin Lakes Estate", "Marion",
];
