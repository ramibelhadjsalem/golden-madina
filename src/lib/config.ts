/**
 * Application Configuration
 *
 * This file contains global constants and configuration values used throughout the application.
 */

// Application Information
export const APP_NAME = "Golden Madina";
export const APP_TAGLINE = "Tunisian creative cultural industries";

// Company Information
export const COMPANY_INFO = {
  name: "Golden Madina",
  foundedYear: 2023,
  artifactsPreserved: "1000+",
  annualVisitors: "25K+",
  address: "pépiniére d'entreprises, 8000",
  city: "Nabeul, Tunisia",
  phone: "+216 25 310 666",
  email: "contact@goldenmadina.art",
  workingHours: "Mon-Fri, 9:00 AM - 5:00 PM",
  visitingHours: "Tue-Sun, 10:00 AM - 5:00 PM",
  responseTime: "24 hours",
  location: {
    latitude: 36.4513,
    longitude: 10.7357
  }
};

// Social Media Links
export const SOCIAL_MEDIA = {
  facebook: "https://www.facebook.com/people/Golden-Madina/100095124842711/",
  instagram: "https://www.instagram.com/goldenmadina_7",
  twitter: "https://twitter.com/heritagegateway",
  whatsup: "https://api.whatsapp.com/send/?phone=21626540666&text&type=phone_number&app_absent=0"
};

// Home Page Carousel Images
export const CAROUSEL_IMAGES = [
  {
    src: "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/499042976_541200562394101_7049174134388784715_n.png?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tHNMDnX57B0Q7kNvwGoiN_1&_nc_oc=AdkMkeVQHHUQA3hT9RpOejDixmKlTqvTqQ6XO-MvePEV7RrvHS31KHBy03Bwa_JV0jY&_nc_zt=23&_nc_ht=scontent.ftun9-1.fna&_nc_gid=NeT7bNMwkZXWJLxNK0Mk1w&oh=00_AfL8dit7ONm3oeJlIxYUgDt5HYsnTYGCuzDsu5obqN714w&oe=6831747C",
    alt: "Historical landmark with mountains in background",
    caption: "Our preservation site in the mountains, circa 1923"
  },
  {
    src: "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/499042976_541200562394101_7049174134388784715_n.png?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tHNMDnX57B0Q7kNvwGoiN_1&_nc_oc=AdkMkeVQHHUQA3hT9RpOejDixmKlTqvTqQ6XO-MvePEV7RrvHS31KHBy03Bwa_JV0jY&_nc_zt=23&_nc_ht=scontent.ftun9-1.fna&_nc_gid=NeT7bNMwkZXWJLxNK0Mk1w&oh=00_AfL8dit7ONm3oeJlIxYUgDt5HYsnTYGCuzDsu5obqN714w&oe=6831747C",

    alt: "History is alive here!",
    caption: "History is alive here!"
  },
  {
    src: "https://scontent.ftun9-1.fna.fbcdn.net/v/t39.30808-6/499042976_541200562394101_7049174134388784715_n.png?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tHNMDnX57B0Q7kNvwGoiN_1&_nc_oc=AdkMkeVQHHUQA3hT9RpOejDixmKlTqvTqQ6XO-MvePEV7RrvHS31KHBy03Bwa_JV0jY&_nc_zt=23&_nc_ht=scontent.ftun9-1.fna&_nc_gid=NeT7bNMwkZXWJLxNK0Mk1w&oh=00_AfL8dit7ONm3oeJlIxYUgDt5HYsnTYGCuzDsu5obqN714w&oe=6831747C",
    alt: "Traditional architectural buildings",
    caption: "Cultural heritage buildings preserved by our foundation"
  },
];

// Our Rich History Section
export const RICH_HISTORY = {
  image: "/slider1.jpg",
  alt: "Historical museum building",
  paragraphs: [
    "Founded in 2023, our institution has been at the forefront of preserving and showcasing the rich cultural heritage of our region. Through careful conservation, research, and education, we connect the past with the present for future generations.",
    "Over the decades, we have expanded from a small local museum to a comprehensive heritage center with state-of-the-art conservation facilities, interactive exhibits, and a vast digital archive accessible worldwide.",
    "Today, we stand as one of the country's preeminent cultural heritage organizations, with over 50,000 artifacts in our collection, award-winning conservation programs, and educational initiatives that reach more than 100,000 people annually."
  ]
};

// Featured Reviews
export const FEATURED_REVIEWS = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "An incredible journey through history. The artifacts are beautifully preserved and the interactive exhibits are engaging for all ages."
  },
  {
    name: "Michael Chen",
    rating: 4.5,
    text: "The guided tour was informative and fascinating. I especially enjoyed the medieval collection and the knowledgeable staff."
  },
  {
    name: "Aisha Rahman",
    rating: 5,
    text: "A must-visit for history enthusiasts! The digital archives and research facilities are exceptional resources for scholars."
  }
];

// Default image to use when an image fails to load
export const DEFAULT_PLACEHOLDER_IMAGE = "/placeholder.jpg";


// Predefined categories
export const PORTFOLIO_CATEGORIES = [
  "Exhibitions",
  "Restorations",
  "Workshops",
  "Events",
  "Publications",
  "Research",
  "Collaborations",
  "Other"
];
