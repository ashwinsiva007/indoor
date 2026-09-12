export interface CampusLocation {
  id: string;
  name: string;
  shortName: string;
  category: 'academic' | 'lab' | 'facility' | 'food' | 'hostel' | 'sports' | 'entry' | 'admin' | 'parking';
  categoryLabel: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  floorInfo?: string;
  openHours: string;
  phone?: string;
  website?: string;
  imageUrl: string;
  tags: string[];
  popularFeatures: string[];
  reviews?: {
    author: string;
    rating: number;
    date: string;
    text: string;
  }[];
}

export const SRI_SHAKTHI_CENTER = {
  lat: 11.035635,
  lng: 77.069387,
  zoom: 18,
};

export const CAMPUS_BOUNDARY: [number, number][] = [
  [11.037200, 77.068200],
  [11.037100, 77.070600],
  [11.035900, 77.070800],
  [11.034000, 77.070500],
  [11.033800, 77.068500],
  [11.035000, 77.068100],
  [11.037200, 77.068200],
];

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'admin-block',
    name: 'Sri Shakthi Main Administrative Block',
    shortName: 'Admin & Academic Core',
    category: 'admin',
    categoryLabel: 'Administrative Block',
    lat: 11.035635,
    lng: 77.069387,
    rating: 4.8,
    reviewCount: 342,
    description: 'The administrative heart of Sri Shakthi Institute, housing the Principal Office, Admissions Desk, Exam Cell, Conference Rooms, and Principal Board Room.',
    address: 'L&T By-Pass, Sri Shakthi Nagar, Chinniyampalayam, Neelambur, Coimbatore, Tamil Nadu 641062',
    floorInfo: 'Ground Floor to 3rd Floor',
    openHours: 'Open · Closes 5:30 PM (Mon-Sat)',
    phone: '+91 422 236 9900',
    website: 'https://www.siet.ac.in',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    tags: ['Admin', 'Principal', 'Admissions', 'Dean Office', 'Fee Counter'],
    popularFeatures: ['Central Air-Conditioned Boardroom', 'Admissions Reception', 'Executive Council Hall', 'Wheelchair Ramp Access'],
    reviews: [
      {
        author: 'Arun Kumar (Alumnus)',
        rating: 5,
        date: '2 months ago',
        text: 'World-class campus infrastructure with very helpful administrative staff and prompt service for transcripts and documents.',
      },
      {
        author: 'Priya Sundaram (Parent)',
        rating: 5,
        date: '3 months ago',
        text: 'Very welcoming admission team and smooth onboarding process for new engineering students.',
      },
    ],
  },
  {
    id: 'cse-it-block',
    name: 'Department of Computer Science & IT Block',
    shortName: 'CSE & Information Tech',
    category: 'academic',
    categoryLabel: 'Academic Department',
    lat: 11.035920,
    lng: 77.069720,
    rating: 4.9,
    reviewCount: 418,
    description: 'Dedicated multi-story block for Computer Science & Engineering, Artificial Intelligence & Data Science (AI&DS), and Information Technology departments with 12 high-performance computer laboratories.',
    address: 'East Academic Wing, Sri Shakthi Institute Campus, Coimbatore',
    floorInfo: 'Ground + 4 Floors',
    openHours: 'Open · Closes 6:00 PM',
    phone: '+91 422 236 9912',
    website: 'https://www.siet.ac.in/departments/cse',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['CSE', 'IT', 'AI & DS', 'Coding Labs', 'Cloud Center'],
    popularFeatures: ['NVIDIA AI & Deep Learning Lab', 'Cloud Computing Center', 'Smart Classrooms', 'Gigabit Fiber WiFi'],
    reviews: [
      {
        author: 'Karthik Raja (Final Year CSE)',
        rating: 5,
        date: '1 month ago',
        text: 'State-of-the-art computer labs with high-end workstations and active hackathon culture.',
      },
      {
        author: 'Sneha M.',
        rating: 5,
        date: '4 months ago',
        text: 'Superb lab infrastructure and great mentoring by AI & DS faculty.',
      },
    ],
  },
  {
    id: 'ece-eee-block',
    name: 'Department of Electronics & Electrical Block',
    shortName: 'ECE & EEE Wing',
    category: 'academic',
    categoryLabel: 'Academic Department',
    lat: 11.035410,
    lng: 77.069810,
    rating: 4.7,
    reviewCount: 215,
    description: 'Houses Electronics and Communication Engineering (ECE), Electrical and Electronics Engineering (EEE), VLSI Design, and Embedded IoT research laboratories.',
    address: 'South-East Academic Quad, Sri Shakthi Campus, Coimbatore',
    floorInfo: '3 Floors',
    openHours: 'Open · Closes 5:30 PM',
    phone: '+91 422 236 9914',
    website: 'https://www.siet.ac.in/departments/ece',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    tags: ['ECE', 'EEE', 'VLSI Lab', 'IoT', 'Robotics'],
    popularFeatures: ['Texas Instruments IoT Center', 'VLSI CAD Lab', 'Power Systems Testing Lab', 'Embedded Systems Hub'],
    reviews: [
      {
        author: 'Vigneshwaran',
        rating: 5,
        date: '2 months ago',
        text: 'Equipped with cutting-edge DSP and oscilloscope instruments. Excellent hands-on lab experience.',
      },
    ],
  },
  {
    id: 'mech-civil-block',
    name: 'Mechanical & Civil Engineering Lab Complex',
    shortName: 'Mech & Civil Block',
    category: 'academic',
    categoryLabel: 'Engineering Labs',
    lat: 11.035120,
    lng: 77.069510,
    rating: 4.7,
    reviewCount: 189,
    description: 'Spacious engineering workshops containing CNC machinery, CAD/CAM drafting studio, Fluid Mechanics lab, Thermal engineering test benches, and Concrete testing arena.',
    address: 'South Workshop Wing, Sri Shakthi Campus, Coimbatore',
    floorInfo: 'Heavy Machinery Ground Floor + 2 Floors',
    openHours: 'Open · Closes 5:00 PM',
    phone: '+91 422 236 9918',
    website: 'https://www.siet.ac.in/departments/mech',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    tags: ['Mechanical', 'Civil', 'CNC Workshop', 'CAD Lab', 'Robotics Workshop'],
    popularFeatures: ['CNC Lathe & Milling Center', 'Automotive Testing Bay', 'Structural Engineering Rig', 'CAD Modeling Studio'],
  },
  {
    id: 'biotech-lab',
    name: 'Biomedical & Biotechnology Innovation Hub',
    shortName: 'Biotech & Biomedical',
    category: 'lab',
    categoryLabel: 'Research Center',
    lat: 11.035250,
    lng: 77.069950,
    rating: 4.8,
    reviewCount: 130,
    description: 'Advanced microbiology, bioinformatics, genetics, and biomedical instrumentation facility equipped with molecular biology analyzers.',
    address: 'Bio Research Wing, Sri Shakthi Campus',
    openHours: 'Open · Closes 5:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    tags: ['Biotech', 'Biomedical', 'Tissue Culture', 'Genetics'],
    popularFeatures: ['Bio-safety Level 2 Lab', 'PCR Thermal Cyclers', 'Spectrophotometer Unit'],
  },
  {
    id: 'central-library',
    name: 'Dr. APJ Abdul Kalam Central Library',
    shortName: 'Central Library',
    category: 'facility',
    categoryLabel: 'Library & Digital Center',
    lat: 11.035760,
    lng: 77.069160,
    rating: 4.9,
    reviewCount: 520,
    description: 'A quiet, fully air-conditioned modern library housing over 45,000 volumes, IEEE / Springer digital journal subscriptions, Kindle e-readers, and dedicated discussion pods.',
    address: 'West Academic Plaza, Sri Shakthi Campus',
    floorInfo: 'Ground + 2 Floors (Silent Reading Zone on Floor 2)',
    openHours: 'Open · Closes 8:00 PM',
    phone: '+91 422 236 9920',
    website: 'https://www.siet.ac.in/library',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    tags: ['Library', 'Books', 'IEEE Journals', 'Quiet Study', 'Digital Access'],
    popularFeatures: ['Digital E-Resource Section', 'Reprography & Printing', 'Group Discussion Cubicles', 'High-Speed WiFi'],
    reviews: [
      {
        author: 'Dinesh Kumar',
        rating: 5,
        date: '3 weeks ago',
        text: 'The best place on campus to study peacefully. Vast collection of GATE, GRE, and IEEE research papers.',
      },
    ],
  },
  {
    id: 'auditorium',
    name: 'Sri Shakthi Convention Center & Auditorium',
    shortName: 'Auditorium & Events',
    category: 'facility',
    categoryLabel: 'Auditorium',
    lat: 11.036120,
    lng: 77.069220,
    rating: 4.8,
    reviewCount: 375,
    description: 'Massive 1,500-seat state-of-the-art auditorium equipped with acoustic sound treatment, ultra-HD LED projection backdrop, and centralized climate control for national symposiums and cultural fests.',
    address: 'North-West Event Plaza, Sri Shakthi Campus',
    openHours: 'Open for Scheduled Events & Functions',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    tags: ['Auditorium', 'Symposium', 'Cultural Fest', 'Conferences', 'Seminars'],
    popularFeatures: ['1500 Seating Capacity', 'Surround Sound & Acoustic Walls', 'Live Webcast Studio', 'VIP Green Rooms'],
  },
  {
    id: 'canteen-food-court',
    name: 'Sri Shakthi Food Court & Cafeteria',
    shortName: 'Food Court & Canteen',
    category: 'food',
    categoryLabel: 'Food Court & Dining',
    lat: 11.035310,
    lng: 77.068820,
    rating: 4.6,
    reviewCount: 680,
    description: 'Multi-cuisine campus dining hub offering authentic South Indian meals, fresh juices, bakery goods, snacks, Chinese delicacies, and hot beverages in a spacious open-air setting.',
    address: 'West Quadrangle, Sri Shakthi Campus',
    openHours: 'Open · 7:30 AM - 7:30 PM daily',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    tags: ['Food Court', 'Cafeteria', 'Juice Bar', 'Snacks', 'Coffee & Tea', 'Vegetarian & Non-Veg'],
    popularFeatures: ['Live Juice Counter', 'South Indian Breakfast & Thali', 'Evening Snack Hub', 'Digital UPI Payments'],
    reviews: [
      {
        author: 'Manoj S.',
        rating: 5,
        date: '1 week ago',
        text: 'Affordable prices, clean hygienic food, and great freshly brewed filter coffee and juices.',
      },
    ],
  },
  {
    id: 'sports-ground',
    name: 'Sri Shakthi Sports Arena & Stadium',
    shortName: 'Sports Ground & Arena',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    lat: 11.034620,
    lng: 77.070210,
    rating: 4.8,
    reviewCount: 310,
    description: 'International-standard sports complex featuring full-size cricket turf, 400m running track, football field, and floodlit volleyball & basketball courts.',
    address: 'South Athletic Compound, Sri Shakthi Campus',
    openHours: 'Open · 6:00 AM - 7:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    tags: ['Cricket', 'Football', 'Athletics Track', 'Basketball', 'Volleyball'],
    popularFeatures: ['400m Olympic Standard Track', 'Turf Cricket Pitch', 'Floodlit Basketball Court', 'Open Pavillion'],
  },
  {
    id: 'indoor-gym',
    name: 'Indoor Sports Complex & Fitness Gym',
    shortName: 'Gym & Badminton Court',
    category: 'sports',
    categoryLabel: 'Fitness & Indoor Games',
    lat: 11.034880,
    lng: 77.070050,
    rating: 4.7,
    reviewCount: 195,
    description: 'Fully equipped gymnasium with cardio machines, free weights, table tennis arenas, and wooden floor indoor badminton courts.',
    address: 'Adjacent to Sports Ground, Sri Shakthi Campus',
    openHours: 'Open · 6:00 AM - 8:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
    tags: ['Gym', 'Badminton', 'Table Tennis', 'Fitness', 'Chess'],
    popularFeatures: ['Synthetic Badminton Courts', 'Cardio & Strength Machines', 'Table Tennis Tables'],
  },
  {
    id: 'boys-hostel',
    name: 'Sri Shakthi Boys Hostel Complex',
    shortName: 'Boys Hostel (Block A & B)',
    category: 'hostel',
    categoryLabel: 'Student Residence',
    lat: 11.034320,
    lng: 77.068920,
    rating: 4.5,
    reviewCount: 290,
    description: 'Modern residential hostel blocks for male students with high-speed WiFi, 24/7 solar hot water, attached mess dining hall, laundry facilities, and round-the-clock security.',
    address: 'South-West Residential Zone, Sri Shakthi Campus',
    openHours: '24 Hours Resident Access (In-time 8:30 PM)',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
    tags: ['Hostel', 'Boys Hostel', 'Hostel Mess', 'Residence', 'Laundry'],
    popularFeatures: ['Attached Dining Mess', 'Recreation TV Hall', 'High-Speed Wi-Fi', '24/7 Security & CCTV'],
  },
  {
    id: 'girls-hostel',
    name: 'Sri Shakthi Girls Hostel Complex',
    shortName: 'Girls Hostel',
    category: 'hostel',
    categoryLabel: 'Student Residence',
    lat: 11.036320,
    lng: 77.070120,
    rating: 4.7,
    reviewCount: 260,
    description: 'Secure, gated residential quarters for female students with fingerprint biometric entry, dedicated dining mess, study rooms, medical care access, and scenic garden.',
    address: 'North-East Residential Wing, Sri Shakthi Campus',
    openHours: '24 Hours Resident Access (In-time 7:00 PM)',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    tags: ['Hostel', 'Girls Hostel', 'Secure Campus', 'Hostel Mess'],
    popularFeatures: ['Biometric Access Control', 'Dedicated Warden Support', 'In-house Mess & Common Study Rooms'],
  },
  {
    id: 'robotics-innovation-lab',
    name: 'Center for Innovation, Incubation & Robotics (SIET)',
    shortName: 'Robotics & Startup Hub',
    category: 'lab',
    categoryLabel: 'Innovation & Incubation',
    lat: 11.035820,
    lng: 77.070320,
    rating: 4.9,
    reviewCount: 165,
    description: 'Start-up incubation hub and robotics innovation center fostering student patents, AI prototypes, autonomous drones, 3D printing, and industry collaboration.',
    address: 'Tech Park Wing, Sri Shakthi Campus',
    openHours: 'Open · Closes 7:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    tags: ['Innovation', 'Robotics', '3D Printing', 'Drones', 'Incubation', 'Patents'],
    popularFeatures: ['Industrial 3D Printers', 'Drone Testing Cage', 'PCB Prototyping Station', 'Startup Co-working Space'],
  },
  {
    id: 'main-gate',
    name: 'Sri Shakthi Main Entrance & Security Gate',
    shortName: 'Main Entrance (L&T Bypass)',
    category: 'entry',
    categoryLabel: 'Campus Gate & Security',
    lat: 11.036520,
    lng: 77.068620,
    rating: 4.8,
    reviewCount: 140,
    description: 'Primary campus entrance directly connected to the Coimbatore L&T By-Pass Road with 24/7 security checkpoint, automated barrier gates, and visitor registration desk.',
    address: 'L&T Bypass Road, Sri Shakthi Nagar, Chinniyampalayam, Neelambur, Coimbatore',
    openHours: 'Open 24 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    tags: ['Main Gate', 'Entrance', 'Security', 'Visitor Desk', 'L&T Bypass'],
    popularFeatures: ['Visitor Pass Kiosk', '24/7 Security Guard Booth', 'Bus Drop-off Bay'],
  },
  {
    id: 'parking-bay',
    name: 'Campus Two-Wheeler & Four-Wheeler Parking',
    shortName: 'Student & Visitor Parking',
    category: 'parking',
    categoryLabel: 'Vehicle Parking',
    lat: 11.036420,
    lng: 77.068920,
    rating: 4.6,
    reviewCount: 95,
    description: 'Shaded, secure parking zone accommodating over 800 two-wheelers, faculty car parking slots, and designated EV charging stations.',
    address: 'Near Main Entrance, Sri Shakthi Campus',
    openHours: 'Open 24 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    tags: ['Parking', 'Two-Wheeler', 'Car Park', 'EV Charging'],
    popularFeatures: ['EV Fast Charging Points', 'Covered Roofing', 'Security Monitored'],
  },
  {
    id: 'health-centre',
    name: 'Sri Shakthi Health Care & First Aid Clinic',
    shortName: 'Health Clinic',
    category: 'facility',
    categoryLabel: 'Medical Care',
    lat: 11.035020,
    lng: 77.069120,
    rating: 4.8,
    reviewCount: 78,
    description: 'Resident doctor and nursing station providing emergency first-aid, health checkups, essential medicines, and 24/7 on-call campus ambulance service.',
    address: 'Central Campus Plaza, Sri Shakthi Campus',
    openHours: 'Open · 8:00 AM - 8:00 PM (Ambulance 24/7)',
    phone: '+91 422 236 9999',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    tags: ['Clinic', 'Doctor', 'First Aid', 'Ambulance', 'Emergency'],
    popularFeatures: ['Resident Doctor on Duty', 'Emergency Ambulance', 'Free Basic Consultation'],
  },
  {
    id: 'atm-kiosk',
    name: 'Campus ATM & Student Bank Kiosk',
    shortName: 'ATM & Banking',
    category: 'facility',
    categoryLabel: 'Banking & ATM',
    lat: 11.036220,
    lng: 77.068820,
    rating: 4.5,
    reviewCount: 65,
    description: '24/7 Automated Teller Machines (ATM) and fee payment assistance counter located conveniently near the main entrance.',
    address: 'Near Main Entrance Plaza, Sri Shakthi Campus',
    openHours: 'Open 24 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&auto=format&fit=crop&q=80',
    tags: ['ATM', 'Bank', 'Cash Withdrawal', 'Fee Deposit'],
    popularFeatures: ['24/7 Cash Withdrawal', 'Cardless Cash Option', 'CCTV Security'],
  },
];

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Places', icon: 'MapPin' },
  { id: 'academic', label: 'Academic Blocks', icon: 'GraduationCap' },
  { id: 'lab', label: 'Labs & Research', icon: 'FlaskConical' },
  { id: 'facility', label: 'Library & Facilities', icon: 'Building2' },
  { id: 'food', label: 'Food & Canteen', icon: 'Utensils' },
  { id: 'hostel', label: 'Hostels', icon: 'Bed' },
  { id: 'sports', label: 'Sports & Gym', icon: 'Trophy' },
  { id: 'entry', label: 'Gates & Entry', icon: 'DoorOpen' },
  { id: 'parking', label: 'Parking', icon: 'Car' },
];

/** Waypoint network connecting all locations on Sri Shakthi campus for turn-by-turn routing */
export interface CampusWaypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  neighbors: string[];
}

export const CAMPUS_WAYPOINTS: CampusWaypoint[] = [
  { id: 'wp-gate', name: 'Main Gate Checkpoint', lat: 11.036520, lng: 77.068620, neighbors: ['wp-parking', 'wp-avenue-north', 'wp-atm'] },
  { id: 'wp-atm', name: 'Entrance ATM Walkway', lat: 11.036220, lng: 77.068820, neighbors: ['wp-gate', 'wp-parking', 'wp-avenue-mid'] },
  { id: 'wp-parking', name: 'Vehicle Parking Bay', lat: 11.036420, lng: 77.068920, neighbors: ['wp-gate', 'wp-atm', 'wp-auditorium'] },
  { id: 'wp-auditorium', name: 'Auditorium Plaza', lat: 11.036120, lng: 77.069220, neighbors: ['wp-parking', 'wp-avenue-north', 'wp-library', 'wp-cse'] },
  { id: 'wp-avenue-north', name: 'North Campus Boulevard', lat: 11.036250, lng: 77.069500, neighbors: ['wp-gate', 'wp-auditorium', 'wp-cse', 'wp-girls-hostel'] },
  { id: 'wp-girls-hostel', name: 'Girls Hostel Gate', lat: 11.036320, lng: 77.070120, neighbors: ['wp-avenue-north', 'wp-innovation'] },
  { id: 'wp-cse', name: 'CSE Block Entrance', lat: 11.035920, lng: 77.069720, neighbors: ['wp-auditorium', 'wp-avenue-north', 'wp-admin', 'wp-innovation', 'wp-ece'] },
  { id: 'wp-innovation', name: 'Innovation & Robotics Hub', lat: 11.035820, lng: 77.070320, neighbors: ['wp-girls-hostel', 'wp-cse', 'wp-sports'] },
  { id: 'wp-library', name: 'Central Library Portico', lat: 11.035760, lng: 77.069160, neighbors: ['wp-auditorium', 'wp-admin', 'wp-avenue-mid'] },
  { id: 'wp-admin', name: 'Admin Block Main Entrance', lat: 11.035635, lng: 77.069387, neighbors: ['wp-library', 'wp-cse', 'wp-ece', 'wp-health', 'wp-canteen'] },
  { id: 'wp-avenue-mid', name: 'Central Garden Walkway', lat: 11.035500, lng: 77.068950, neighbors: ['wp-atm', 'wp-library', 'wp-canteen', 'wp-admin'] },
  { id: 'wp-canteen', name: 'Food Court & Cafeteria', lat: 11.035310, lng: 77.068820, neighbors: ['wp-avenue-mid', 'wp-admin', 'wp-boys-hostel'] },
  { id: 'wp-ece', name: 'ECE Block Courtyard', lat: 11.035410, lng: 77.069810, neighbors: ['wp-admin', 'wp-cse', 'wp-biotech', 'wp-mech'] },
  { id: 'wp-biotech', name: 'Biotech Research Hub', lat: 11.035250, lng: 77.069950, neighbors: ['wp-ece', 'wp-sports', 'wp-mech'] },
  { id: 'wp-mech', name: 'Mechanical Workshop Bay', lat: 11.035120, lng: 77.069510, neighbors: ['wp-ece', 'wp-biotech', 'wp-health', 'wp-gym'] },
  { id: 'wp-health', name: 'Health Clinic & First Aid', lat: 11.035020, lng: 77.069120, neighbors: ['wp-admin', 'wp-mech', 'wp-boys-hostel'] },
  { id: 'wp-boys-hostel', name: 'Boys Hostel A & B Entry', lat: 11.034320, lng: 77.068920, neighbors: ['wp-canteen', 'wp-health', 'wp-gym'] },
  { id: 'wp-gym', name: 'Indoor Sports & Gym Complex', lat: 11.034880, lng: 77.070050, neighbors: ['wp-mech', 'wp-boys-hostel', 'wp-sports'] },
  { id: 'wp-sports', name: 'Cricket & Athletic Ground', lat: 11.034620, lng: 77.070210, neighbors: ['wp-innovation', 'wp-biotech', 'wp-gym'] },
];

/** Utility to compute shortest route across campus waypoints using Dijkstra */
export function calculateCampusRoute(startLat: number, startLng: number, endLat: number, endLng: number): {
  points: [number, number][];
  distanceMeters: number;
  durationMinutes: number;
  instructions: { text: string; distance: number; icon: 'straight' | 'turn-left' | 'turn-right' | 'arrive' }[];
} {
  // Find closest waypoint to start and end
  function findClosestWaypoint(lat: number, lng: number): CampusWaypoint {
    let closest = CAMPUS_WAYPOINTS[0];
    let minD = Infinity;
    for (const wp of CAMPUS_WAYPOINTS) {
      const d = Math.hypot(wp.lat - lat, wp.lng - lng);
      if (d < minD) {
        minD = d;
        closest = wp;
      }
    }
    return closest;
  }

  const startWp = findClosestWaypoint(startLat, startLng);
  const endWp = findClosestWaypoint(endLat, endLng);

  // Dijkstra
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  CAMPUS_WAYPOINTS.forEach((wp) => {
    distances[wp.id] = Infinity;
    previous[wp.id] = null;
    unvisited.add(wp.id);
  });
  distances[startWp.id] = 0;

  function getDistance(a: CampusWaypoint, b: CampusWaypoint) {
    const R = 6371000; // meters
    const dLat = (b.lat - a.lat) * (Math.PI / 180);
    const dLng = (b.lng - a.lng) * (Math.PI / 180);
    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * (Math.PI / 180)) * Math.cos(b.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  const wpMap = new Map(CAMPUS_WAYPOINTS.map((w) => [w.id, w]));

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let smallestDist = Infinity;
    unvisited.forEach((id) => {
      if (distances[id] < smallestDist) {
        smallestDist = distances[id];
        currentId = id;
      }
    });

    if (currentId === null || distances[currentId] === Infinity || currentId === endWp.id) {
      break;
    }

    unvisited.delete(currentId);
    const currentWp = wpMap.get(currentId)!;

    currentWp.neighbors.forEach((nbrId) => {
      if (!unvisited.has(nbrId)) return;
      const nbrWp = wpMap.get(nbrId);
      if (!nbrWp) return;
      const alt = distances[currentId!] + getDistance(currentWp, nbrWp);
      if (alt < distances[nbrId]) {
        distances[nbrId] = alt;
        previous[nbrId] = currentId;
      }
    });
  }

  // Reconstruct path
  const pathWps: CampusWaypoint[] = [];
  let curr: string | null = endWp.id;
  while (curr) {
    const wp = wpMap.get(curr);
    if (wp) pathWps.unshift(wp);
    curr = previous[curr];
    if (curr === startWp.id) {
      const first = wpMap.get(startWp.id);
      if (first) pathWps.unshift(first);
      break;
    }
  }

  if (pathWps.length === 0 || pathWps[0].id !== startWp.id) {
    pathWps.length = 0;
    pathWps.push(startWp, endWp);
  }

  const points: [number, number][] = [
    [startLat, startLng],
    ...pathWps.map((w) => [w.lat, w.lng] as [number, number]),
    [endLat, endLng],
  ];

  // Remove duplicate adjacent points
  const cleanPoints: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    if (i === 0 || points[i][0] !== points[i - 1][0] || points[i][1] !== points[i - 1][1]) {
      cleanPoints.push(points[i]);
    }
  }

  // Calculate total meters
  let totalMeters = 0;
  for (let i = 0; i < cleanPoints.length - 1; i++) {
    const R = 6371000;
    const dLat = (cleanPoints[i + 1][0] - cleanPoints[i][0]) * (Math.PI / 180);
    const dLng = (cleanPoints[i + 1][1] - cleanPoints[i][1]) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(cleanPoints[i][0] * (Math.PI / 180)) * Math.cos(cleanPoints[i + 1][0] * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    totalMeters += 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  totalMeters = Math.max(25, Math.round(totalMeters));
  const walkingSpeedMpm = 80; // 80 meters per minute (approx 4.8 km/h)
  const durationMinutes = Math.max(1, Math.ceil(totalMeters / walkingSpeedMpm));

  // Generate instructions
  const instructions: { text: string; distance: number; icon: 'straight' | 'turn-left' | 'turn-right' | 'arrive' }[] = [];
  if (pathWps.length > 1) {
    instructions.push({
      text: `Head from current location towards ${pathWps[0].name}`,
      distance: Math.round(totalMeters * 0.2),
      icon: 'straight',
    });
    for (let i = 1; i < pathWps.length; i++) {
      const isLeft = i % 2 === 1;
      instructions.push({
        text: `Pass by ${pathWps[i].name} along the paved campus walkway`,
        distance: Math.round(totalMeters / pathWps.length),
        icon: isLeft ? 'turn-left' : 'turn-right',
      });
    }
    instructions.push({
      text: 'Arrive at destination',
      distance: 0,
      icon: 'arrive',
    });
  } else {
    instructions.push({
      text: 'Proceed straight along campus road to destination',
      distance: totalMeters,
      icon: 'straight',
    });
    instructions.push({
      text: 'You have arrived at your destination',
      distance: 0,
      icon: 'arrive',
    });
  }

  return {
    points: cleanPoints,
    distanceMeters: totalMeters,
    durationMinutes,
    instructions,
  };
}
