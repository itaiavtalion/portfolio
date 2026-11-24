// ============================================================
//  PROJECTS — the single source of truth for the whole site.
//  To add a project: copy one object, change the fields, drop
//  images into assets/img/<id>/, commit, push. Nothing else.
//
//  Text wrapped in [[ double brackets ]] is a fill-in marker.
//  Set draft: true while a write-up is unfinished; the site shows
//  an "In progress" badge and styles the markers so they stand out.
// ============================================================

const PROJECTS = [
  {
    id: "hydro-valve",
    order: 1,
    draft: false,
    title: "Self-Powered Autonomous Hydro-Valve System",
    subtitle: "An irrigation valve that powers itself from the water it controls and takes commands through soil over sub-GHz LoRa.",
    category: "Electromechanical Systems · Embedded IoT",
    timeline: "2025",
    role: "Concept, electronics, firmware, enclosure",
    cover: "assets/img/hydro-valve/schematic.jpg",
    coverPosition: "50% 50%",
    summary:
      "Standard underground valves need hardwired power or recurring battery service. This system removes both. An in-line micro-hydro generator sits in the flow path and harvests kinetic energy every time the zone runs, keeping a 3.7 V LiPo in perpetual surplus. A Heltec ESP32 LoRa 32 controller sleeps at microamp levels and wakes on sub-GHz LoRa Channel Activity Detection, so the valve can be commanded through dense soil and buried valve pits using orders of magnitude less power than Wi-Fi or Bluetooth.",
    highlights: [
      { value: "~15 µA", label: "standby draw in LoRa CAD deep sleep" },
      { value: "0", label: "external wires, conduit or trenching" },
      { value: "2.5 A", label: "motor inrush absorbed with no logic brownout" }
    ],
    skills: ["Power electronics", "Embedded firmware", "Low-power RF design", "Energy harvesting", "Enclosure design (DFM)"],
    software: ["SolidWorks", "Arduino IDE", "Bambu Studio"],
    hardware: [
      "Heltec ESP32 LoRa 32 (V4)",
      "MP1584EN buck converter",
      "TPS61088 synchronous boost",
      "LR7843 MOSFET module",
      "1N5819 Schottky diode",
      "3.7 V 3000 mAh LiPo",
      "In-line micro-hydro turbine",
      "12 V motorized ball valve"
    ],
    specs: [
      { parameter: "Power topology", target: "Zero external utility wiring", achieved: "100% in-line hydro harvesting", status: "met" },
      { parameter: "Energy balance", target: "Perpetual net-positive balance", achieved: "Power surplus, battery maintenance-free", status: "met" },
      { parameter: "RF propagation", target: "Subterranean transmission", achieved: "Sub-GHz LoRa (Heltec ESP32-S3 V4)", status: "met" },
      { parameter: "Quiescent drain", target: "Ultra-low deep-sleep baseline", achieved: "CAD sleep cycling, microamps", status: "met" },
      { parameter: "Actuation torque", target: "12 V DC full-flow motorized ball valve", achieved: "TPS61088 synchronous 12 V boost rail", status: "met" },
      { parameter: "Reverse protection", target: "Zero battery backfeed during stagnation", achieved: "1N5819 Schottky isolation barrier", status: "met" }
    ],
    sections: [
      {
        heading: "How the system fits together",
        body:
          "The schematic above shows the four loops: turbine power generation, battery charging, 12 V motor drive and wireless LoRa CAD control. Micro-hydro generator output is rectified and regulated through an MP1584EN buck converter to charge the 3.7 V LiPo. A TPS61088 synchronous booster steps the battery rail up to 12 V to drive the motorized ball valve through an LR7843 MOSFET switch, all coordinated by the Heltec ESP32 LoRa 32 V4 controller.",
        images: []
      },
      {
        heading: "Hardware subsystems",
        body:
          "**Kinetic energy harvesting.** An in-line Pelton-style DC micro-turbine captures energy directly from fluid discharge. Variable DC is routed through an adjustable MP1584EN step-down converter calibrated for safe 3.7 V LiPo charging, protected by a 1N5819 low-drop Schottky diode against reverse leakage during no-flow intervals.\n\n" +
          "**Dual-rail power management.** A 3.7 V 3000 mAh LiPo acts as the energy reservoir, decoupling motor burst demand from real-time generation. A dedicated TPS61088 synchronous boost converter lifts the 3.7 V rail to a robust 12 V DC with enough inrush headroom for valve transit without brownout.\n\n" +
          "**Wireless sub-GHz telemetry.** The Heltec ESP32 LoRa 32 (V4) module, with its on-board 0.96\" OLED diagnostic display, operates below 1 GHz to bypass the steep attenuation that 2.4 GHz Wi-Fi and Bluetooth suffer through dense soil, wet turf and submerged composite utility boxes.\n\n" +
          "**Low-loss valve actuation.** Actuation runs through a solid-state LR7843 MOSFET module triggered from GPIO 2. A 12 V motorized ball valve was chosen over a solenoid to eliminate continuous holding current and the hydraulic water hammer a solenoid causes on closure.",
        images: []
      },
      {
        heading: "Benchtop circuitry and harness integration",
        body:
          "Validation setup with the power-conditioning circuitry, 3000 mAh LiPo, synchronous boost stage, Heltec ESP32 LoRa controller running the telemetry firmware, the DC micro-hydro generator and the motorized ball valve all interconnected.",
        images: [
          { src: "assets/img/hydro-valve/bench-prototype.jpg", caption: "Electromechanical benchtop prototype." }
        ]
      },
      {
        heading: "Mechanical packaging and field enclosure",
        body:
          "Buried valve environments bring extreme humidity, soil exposure and moisture ingress. The electronics suite, battery and step-up modules are packaged inside a custom precision enclosure with internal isolated mounting planes to decouple power-converter heat from the microcontroller, recessed perimeter screw anchors for environmental sealing, and direct inline brass union couplings to the turbine and valve bodies.",
        images: [
          { src: "assets/img/hydro-valve/field-unit.jpg", caption: "Fully packaged field-ready unit: sealed electronics chassis coupled to the micro-hydro inlet and motorized valve outlet. A true wire-free drop-in plumbing replacement." }
        ]
      }
    ],
    iterations: [
      { title: "Energy surplus and deep-sleep scheduling", problem: "Continuous polling depleted battery reserves prematurely.", fix: "Engineered a low-power scheduling loop using LoRa Channel Activity Detection. The ESP32 stays in deep sleep (~15 µA) until pinged, so normal irrigation intervals generate a substantial net-positive energy surplus." },
      { title: "High-inrush motor surge", problem: "Valve transit starts with a heavy inductive inrush that initially caused 3.7 V logic brownout.", fix: "Sized a high-efficiency TPS61088 synchronous step-up converter with low-ESR ceramic filtering to cushion peak draws up to 2.5 A without disturbing the logic rails." },
      { title: "Reverse leakage current", problem: "With no flow, the unpowered buck regulator acted as a parasitic load on the LiPo.", fix: "Added a 1N5819 Schottky barrier diode on the charging rail, bringing quiescent back-leakage down to negligible microamp levels." }
    ],
    links: [
      { label: "Original case study (PDF)", href: "assets/pdf/hydro-valve-case-study.pdf", kind: "pdf" }
    ],
    videos: []
  },

  {
    id: "prosthetic-hand",
    order: 2,
    draft: false,
    title: "3D-Printed Functional Prosthetic Hand",
    subtitle: "A servo-driven, tendon-actuated upper-limb prosthetic prototype built for under $30 in materials.",
    category: "Biomechatronics · Mechanism Design",
    timeline: "2025 · NJIT FED 101",
    role: "CAD, printing, assembly, electronics and testing",
    cover: "assets/img/prosthetic-hand/prototype.jpg",
    coverPosition: "50% 45%",
    summary:
      "Upper-limb prosthetics remain cost-prohibitive for millions of people. This Fundamentals of Engineering Design project at NJIT set out to replicate essential human grasping with a design anyone can fabricate on a desktop 3D printer with off-the-shelf electronics. Modular PLA digits are driven by a high-torque micro-servo through routed nylon tendons, with elastic bands supplying the return force. The finished prototype closes in 1.0 second, holds a 370 g payload, weighs 1.50 lb and cost less than $30 to build.",
    highlights: [
      { value: "< $30", label: "material cost (PLA + servo + Arduino Nano)" },
      { value: "1.0 s", label: "full power-grasp closure" },
      { value: "370 g", label: "sustained payload" }
    ],
    skills: ["Mechanism design", "Tendon-driven actuation", "Rapid prototyping", "Tolerance and fit", "Iterative testing"],
    software: ["SolidWorks", "Bambu Studio", "Arduino IDE"],
    hardware: ["Arduino Nano", "High-torque micro servo", "PLA (FDM printed)", "Nylon tendon line", "Elastic return bands", "Breadboard + battery pack"],
    specs: [
      { parameter: "Total device weight", target: "< 1.50 lb (680 g)", achieved: "1.50 lb total mass", status: "met" },
      { parameter: "Manufacturing cost", target: "< $30.00", achieved: "< $30.00 (PLA + servo + Nano)", status: "met" },
      { parameter: "Grip actuation speed", target: "Rapid closing response", achieved: "1.0 s full closure", status: "met" },
      { parameter: "Payload capacity", target: "Everyday household items", achieved: "Up to 370 g", status: "met" },
      { parameter: "Structural material", target: "PLA filament, 3D printed", achieved: "High-density PLA shell", status: "met" },
      { parameter: "Actuation method", target: "Servo-driven tendon cables", achieved: "High-torque servo + fishing line", status: "met" }
    ],
    sections: [
      {
        heading: "Mechanical architecture",
        body:
          "The device splits into interconnected subsystems, each optimized in SolidWorks for additive manufacturing and stress distribution.\n\n" +
          "**Modular finger linkages.** Each finger is three interlocking segments (tip, mid, lower) held by custom 3D-printed pin joints. Internal channels guide nylon tendons for active flexion while elastic back-bands return the finger to open.\n\n" +
          "**Palm base anchor.** The central mounting chassis for all five digits, with angled guide orifices that route tendons smoothly into the forearm without binding.\n\n" +
          "**Forearm electronics housing.** A hollow ergonomic enclosure (7.00\" internal length) carrying the main servo, breadboard, battery pack and Arduino Nano.\n\n" +
          "**Actuation circuitry.** One high-torque servo pulls all five tendon lines simultaneously to execute a unified power grasp.",
        images: [
          { src: "assets/img/prosthetic-hand/assembled-hand.jpg", caption: "Fully assembled 3D-printed palm and finger assembly showing anatomical joint alignment." },
          { src: "assets/img/prosthetic-hand/palm-front.jpg", caption: "Front view showing anatomical joint alignment and the offset thumb." }
        ]
      },
      {
        heading: "CAD",
        body: "Exploded SolidWorks model of the digits, palm anchor, pins and forearm housing.",
        images: [
          { src: "assets/img/prosthetic-hand/cad-exploded.jpg", caption: "Exploded SolidWorks CAD model detailing components." }
        ]
      },
      {
        heading: "Future roadmap",
        body:
          "- Myoelectric control: surface EMG sensors to read forearm muscle contractions for intuitive control.\n" +
          "- Compliant grip pads: TPU or silicone fingertips to reduce slip on smooth, curved surfaces.\n" +
          "- Fiber-reinforced printing: PETG or carbon-fiber PLA for structural durability.",
        images: []
      }
    ],
    iterations: [
      { title: "Joint pin tolerance and friction", problem: "Initial metal pins caused either excessive binding or excessive slack.", fix: "Designed custom compressible 3D-printed snap pins that hold tight tolerances while rotating smoothly." },
      { title: "Thumb opposition angle", problem: "Early prints placed the thumb parallel to the fingers, preventing an effective grasp.", fix: "Re-engineered the thumb joint at an offset angle for anatomical opposition against the index and middle fingers." },
      { title: "Tendon route friction", problem: "Cable friction inside the palm slowed the grasp.", fix: "Chamfered and smoothed the internal palm channels, enabling the 1.0 s power-grasp response." }
    ],
    links: [
      { label: "Original case study (PDF)", href: "assets/pdf/prosthetic-hand-case-study.pdf", kind: "pdf" },
      { label: "Prototype video demo", href: "https://drive.google.com/file/d/1cMehkLD05mA7CgPNLcuOTKP0tDlBN7R5/view", kind: "video" }
    ],
    videos: []
  },

  {
    id: "nfc-signage",
    order: 3,
    draft: false,
    title: "3D-Printed Modular NFC Signage System",
    subtitle: "A product line of interlocking, NFC-enabled 3D-printed business signs, designed, manufactured and sold through my own storefront, 3D-Signs.",
    category: "Product Design · DFM · Commercial IoT",
    timeline: "Oct 2025 – present",
    role: "Founder, designer, manufacturer",
    cover: "assets/img/nfc-signage/installed-sign.jpg",
    coverPosition: "50% 42%",
    summary:
      "3D-Signs is a line of modular, smart-enabled 3D-printed business signs. Parametric CAD in Fusion 360 and embedded NFC tags let a physical sign bridge offline branding with instant mobile redirection: tap a phone and the customer's website or property listing opens. The system is engineered for scalable manufacturing and cheap shipping, and has been deployed to retail storefronts, real-estate listings and landscape clients.",
    highlights: [
      { value: "30+", label: "custom units sold and deployed" },
      { value: "65%", label: "smaller shipping volume from flat-pack design" },
      { value: "< 0.1 s", label: "NFC tap to web redirect" }
    ],
    skills: ["Parametric CAD", "Design for manufacture", "Design for logistics", "Product development", "E-commerce operations"],
    software: ["Autodesk Fusion 360", "Bambu Studio", "Shopify"],
    hardware: ["NTAG216 NFC inlays", "FDM print farm", "Wood-textured PLA filament", "Dovetail and snap-fit joints"],
    specs: [
      { parameter: "CAD modeling", target: "Autodesk Fusion 360 parametric design", achieved: "Optimized dovetail and snap-fit joints", status: "met" },
      { parameter: "IoT integration", target: "Embedded NFC inlay (NTAG216)", achieved: "Instant web redirection (< 0.1 s latency)", status: "met" },
      { parameter: "Shipping and logistics", target: "Modular multi-part knockdown assembly", achieved: "Box volume reduced 65% for lower freight", status: "met" },
      { parameter: "Production scale", target: "Shopify storefront + FDM print farm", achieved: "30+ custom units sold and deployed", status: "met" }
    ],
    sections: [
      {
        heading: "System design and mechanical architecture",
        body:
          "The signage uses a modular multi-tile framework engineered in Fusion 360 to get around print-bed size limits and simplify logistics.\n\n" +
          "- Dovetail interlocking frames: custom dovetail joints let clients expand or downsize sign dimensions modularly.\n" +
          "- Smart NFC integration: discreetly embedded tags trigger automated web redirection on customer phones.\n" +
          "- Knockdown logistics: designed to ship flat for low-cost parcel shipping and easy customer assembly.\n" +
          "- Shopify operations: end-to-end production management via automated ordering and FDM print workflows.",
        images: [
          { src: "assets/img/nfc-signage/cad-exploded.jpg", caption: "Exploded CAD view of the modular frame tiles, interlocking dovetails and hardware placement." }
        ]
      },
      {
        heading: "Finished product and client deployment",
        body:
          "The manufactured product combines high-contrast wood-textured filaments, clean typography and seamless smart-device integration. The sign shown at the top of this page was custom-built for an award-winning landscaping company as an interactive touchpoint for customer inquiries.",
        images: []
      },
      {
        heading: "Commercial impact",
        body:
          "By solving the packaging and scaling bottlenecks early, the product line has delivered consistent customer satisfaction and profitable unit economics across more than 30 custom deployments.",
        images: []
      }
    ],
    iterations: [],
    links: [
      { label: "Original case study (PDF)", href: "assets/pdf/nfc-signage-case-study.pdf", kind: "pdf" }
    ],
    videos: []
  },

  {
    id: "gyro-gimbal",
    order: 4,
    draft: false,
    title: "Self-Stabilizing Gyro Gimbal",
    subtitle: "A handheld 3-axis gimbal that keeps a sensor or small camera level while the handle moves: an MPU-6050, three servos and a PID loop on an ESP32, all packaged inside a 3D-printed grip.",
    category: "Mechatronics · Control Systems",
    timeline: "Oct – Nov 2026",
    role: "Concept, CAD, electronics, firmware",
    cover: "assets/img/gyro-gimbal/cad-assembled.png",
    coverPosition: "50% 12%",
    summary:
      "A hands-on robotics and control-systems build: a top mounting plate for a sensor or small camera stays level no matter how the handle is tilted or turned. A GY-521 (MPU-6050) measures tilt and rotation rate, an ESP32 fuses the readings with a complementary filter and runs a PID loop, and three TowerPro MG996R metal-gear servos move pitch, roll and yaw brackets to cancel the motion. The hollow cylindrical handle doubles as the grip and hides the 2S LiPo, buck converter and wiring, so the gimbal runs untethered for about an hour to an hour and a half per charge.",
    highlights: [
      { value: "3 axes", label: "pitch, roll and yaw, each on its own servo" },
      { value: "5.0 V", label: "regulated rail for servos and ESP32, steady under load" },
      { value: "1–1.5 h", label: "runtime on the 2S 1100 mAh LiPo" }
    ],
    skills: ["Control systems (PID)", "IMU sensor fusion", "Embedded firmware", "Power management", "Mechanical packaging", "Fit and clearance checks"],
    software: ["SolidWorks", "Arduino Cloud Editor", "Arduino IDE", "Claude Code"],
    hardware: ["ESP-WROOM-32 DevKit (30-pin)", "GY-521 MPU-6050 IMU", "3× TowerPro MG996R servos", "5 A DC-DC buck converter", "2S 7.4 V 1100 mAh LiPo", "3D-printed handle and brackets", "Perfboard carrier"],
    specs: [
      { parameter: "Stabilization axes", target: "3-axis: pitch, roll, yaw", achieved: "Three independent servo-driven brackets", status: "met" },
      { parameter: "Angle tracking", target: "Real-time angles that match actual motion", achieved: "Verified against the live 3D simulation", status: "met" },
      { parameter: "Range of motion", target: "Full tilt and rotation, no bracket collisions", achieved: "Confirmed on the assembled unit", status: "met" },
      { parameter: "Power rail", target: "Steady 5.0 V to servos and ESP32", achieved: "5.0 V held under servo load (buck display)", status: "met" },
      { parameter: "Runtime", target: "Untethered handheld use", achieved: "About 1–1.5 h per charge", status: "met" }
    ],
    sections: [
      {
        heading: "Mechanical design",
        body:
          "The cylindrical handle, the slotted top mounting plate and all three L-shaped servo brackets were designed and fit-checked in SolidWorks alongside imported models of the off-the-shelf electronics, then 3D-printed. The hollow cylinder is both a comfortable handheld grip and the enclosure: battery, buck converter and wiring live inside so the gimbal runs wirelessly. The perfboard and buck converter mount on a custom internal carrier board that slides cleanly into the handle, with the servo wires routed up through the center.",
        images: [
          { src: "assets/img/gyro-gimbal/cad-assembled.png", caption: "Assembled CAD: three stacked L-brackets carry the pitch, roll and yaw servos above the cylindrical handle." },
          { src: "assets/img/gyro-gimbal/cad-exploded.png", caption: "Exploded CAD: top plate and servo brackets, handle, slide-in carrier board with the electronics, and end cap." }
        ]
      },
      {
        heading: "Control loop",
        body:
          "The ESP32 continuously reads the MPU-6050 to track which way the handle is tilting. To get a clean angle without jitter or drift, it blends two signals with a complementary filter: fast rotation updates from the gyroscope, anchored to gravity by the accelerometer. A PID loop then checks how far off-level the top platform is and commands the servos to rotate the opposite way to cancel the movement.\n\n" +
          "Tuning was done by hand: raise the proportional gain until the servos react quickly without shaking, then add derivative damping so the platform stops without overshooting or bouncing. The Arduino Cloud Editor was used to write and upload the code, read live pitch, roll and yaw numbers, and run an on-screen 3D block that mirrors the sensor's movement in real time.",
        images: []
      },
      {
        heading: "Demo",
        body: "",
        images: [],
        videos: [
          { src: "assets/video/gimbal-demo-1.mp4", poster: "assets/video/gimbal-demo-1-poster.jpg", caption: "Breadboard and 3D simulation test: tilting the ESP32 + MPU-6050 by hand while the laptop shows live pitch, roll and yaw and a 3D block mirrors the motion." },
          { src: "assets/video/gimbal-demo-2.mp4", poster: "assets/video/gimbal-demo-2-poster.jpg", caption: "Assembled gimbal test: tilting and rotating the sensor while the 3-axis gimbal, powered through the 5.0 V buck converter, keeps the top platform level." }
        ]
      },
      {
        heading: "Electronics and power",
        body:
          "A 2-cell 7.4 V 1100 mAh LiPo feeds a 5 A DC-DC buck converter with a built-in voltage display, which steps the pack down to 5.0 V for the three servos and the ESP32 on a shared rail with a common ground. The ESP-WROOM-32 DevKit and GY-521 sit on a perfboard inside the handle. Output was checked at a steady 5.0 V under servo load on the converter's display.",
        images: [
          { src: "assets/img/gyro-gimbal/bench.jpg", caption: "Bench prototype before packaging: ESP32 on perfboard, buck converter with voltage display, 2S 1100 mAh LiPo and the printed handle." }
        ]
      },
      {
        heading: "What's next",
        body:
          "- Switch to a 9-axis sensor with a built-in compass to eliminate yaw drift.\n" +
          "- Replace the geared hobby servos with silent brushless gimbal motors for smoother motion.\n" +
          "- Replace the hand-wired perfboard inside the tube with a custom PCB.",
        images: []
      }
    ],
    iterations: [
      { title: "Reversed axis direction and uncentered servos", problem: "Tilting the board made the servos push further into the tilt instead of leveling out, and the brackets sat crooked at rest.", fix: "Flipped the sign for that axis in the code and ran a centering script to lock all servos at 90° before tightening the servo horns." },
      { title: "Packaging the electronics inside the handle", problem: "Fitting the perfboard, buck converter, battery and wiring inside the tight cylindrical grip without crowding or pinching wires.", fix: "Imported 3D models of the off-the-shelf components into SolidWorks to verify clearances first, then designed a custom slide-in carrier board that holds the perfboard and buck converter so the whole assembly slips neatly into the handle." }
    ],
    links: [],
    videos: []
  }
];
