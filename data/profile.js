// ============================================================
//  PROFILE — everything about Itai that is not a project.
//  [[ double brackets ]] mark text to fill in.
// ============================================================

const PROFILE = {
  name: "Itai Avtalion",
  firstName: "Itai",
  initials: "IA",
  photo: "assets/img/itai.jpg",
  tagline: "Mechanical engineering student who builds electromechanical systems end to end: CAD, power electronics, embedded firmware and 3D-printed hardware.",
  eyebrow: "Mechanical Engineering · NJIT '28 · Cresskill, NJ",
  location: "Cresskill, NJ",
  facts: [
    { value: "NJIT '28", label: "B.S. Mechanical Engineering" },
    { value: "2 companies", label: "founded: 3D-Signs, Fixora LLC" },
    { value: "ESP32 · LoRa", label: "embedded + power electronics" },
    { value: "SolidWorks · Fusion", label: "CAD and FDM prototyping" }
  ],
  bio: [
    "I'm a mechanical engineering student at NJIT who likes problems that cross disciplines: a valve that has to harvest its own power, a prosthetic hand that has to close in a second for under $30, a product that has to ship flat and survive a storefront wall. I design in SolidWorks and Fusion 360, prototype on FDM printers, and write the firmware that runs on the ESP32 and Arduino boards inside.",
    "Before engineering I earned a B.A. in Economics at Binghamton with a minor in Digital and Data Science, and I spent two years as an appliance repair technician diagnosing 12–240 V circuits, compressors and sealed refrigeration loops. That hands-on diagnostic work is why my projects tend to start on the bench rather than on the screen. I run two small businesses on the side: 3D-Signs, a line of NFC-enabled 3D-printed signage, and Fixora LLC, an appliance repair service.",
    "[[ Optional third paragraph: what you want to work on next, or what kind of team you're looking for. ]]"
  ],
  education: [
    { school: "New Jersey Institute of Technology", degree: "B.S. Mechanical Engineering", timeline: "Expected May 2028", location: "Newark, NJ", notes: "Coursework: Statics, Dynamics, Strength of Materials, Engineering Design, Physics, Materials & Processes" },
    { school: "Binghamton University", degree: "B.A. Economics, minor in Digital & Data Science", timeline: "May 2024", location: "Binghamton, NY", notes: "" }
  ],
  experience: [
    { role: "Founder / Lead Designer", org: "3D-Signs", timeline: "Oct 2025 – present", location: "New Jersey",
      bullets: ["Engineered modular signage systems in Fusion 360 with custom interlocking dovetail joints to bypass print-bed limits.", "Embedded NTAG216 NFC tags in the print layers for instant (< 0.1 s) mobile web redirection.", "Designed flat-pack knockdown assemblies that cut shipping volume 65%; fulfilled 30+ custom commercial units through a Shopify storefront."] },
    { role: "Founder / Lead Technician", org: "Fixora LLC", timeline: "Jun 2025 – present", location: "New Jersey",
      bullets: ["Run end-to-end electrical and mechanical diagnostics and repairs for residential and commercial equipment.", "Troubleshoot electro-mechanical failures across sealed refrigeration loops, high-torque motors and solid-state control boards from schematics and service manuals.", "Own customer acquisition, scheduling, inventory, vendors and financial tracking."] },
    { role: "Appliance Repair Technician", org: "Global Solutions", timeline: "Aug 2024 – Aug 2025", location: "Brooklyn, NY",
      bullets: ["Diagnosed and repaired 12–240 V circuit faults, motor failures and mechanical breakdowns using schematics and multimeters.", "Repaired sealed-system components: compressors, evaporators, condensers and refrigerant handling."] },
    { role: "Data Analyst Intern", org: "Broome County Food Council", timeline: "Sep 2023 – Dec 2023", location: "Binghamton, NY",
      bullets: ["Regression modeling and trend analysis in R across regional survey datasets to identify community aid gaps.", "Geospatial mapping of high-need zones to plan mobile pantry routes for regional policymakers."] }
  ],
  skills: [
    { group: "CAD & fabrication", items: ["SolidWorks (CSWP in prep)", "Autodesk Fusion 360", "CNC routing", "Bambu Studio", "DFM / DFA", "FDM printing (PLA, PETG, ASA)"] },
    { group: "Electrical & control", items: ["ESP32", "Arduino", "Sub-GHz LoRa", "Buck / boost power conversion", "MOSFET switching", "12–240 V diagnostics"] },
    { group: "Mechanical systems", items: ["Motors", "Compressors", "HVAC", "Sealed refrigeration loops", "Kinematic linkages", "Actuators"] },
    { group: "Software & data", items: ["Python", "R", "Excel (modeling, regression)", "Arduino IDE / Cloud", "Claude Code"] },
    { group: "Diagnostics & tools", items: ["Digital multimeter", "Amp clamp", "Manifold gauges", "Electronic leak detectors", "Shop power tools"] }
  ],
  languages: ["English (fluent)", "Hebrew (fluent)"],
  hobbies: ["Golf", "Guitar", "Sports", "Travel", "Snowboarding", "Lifting"],
  contact: {
    email: "itai.avtalion@gmail.com",
    phone: "(201) 240-2184",
    phoneHref: "tel:+12012402184",
    github: "https://github.com/itaiavtalion",
    linkedin: "",               // paste the full LinkedIn URL here, e.g. https://www.linkedin.com/in/itai-avtalion/
    resume: "assets/pdf/itai-avtalion-resume.pdf"
  }
};
