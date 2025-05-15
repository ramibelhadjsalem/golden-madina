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
  foundedYear: 1895,
  artifactsPreserved: "50,000+",
  annualVisitors: "100K+",
  address: "123 Heritage Street",
  city: "Historic District, HT 12345",
  phone: "+216 25 310 666",
  email: "contact@goldenmadina.art",
};

// Social Media Links
export const SOCIAL_MEDIA = {
  facebook: "https://www.facebook.com/people/Golden-Madina/100095124842711/",
  instagram: "https://www.instagram.com/goldenmadina_7",
  twitter: "https://twitter.com/heritagegateway",
  whatsup:"https://api.whatsapp.com/send/?phone=21626540666&text&type=phone_number&app_absent=0"
};

// Home Page Carousel Images
export const CAROUSEL_IMAGES = [
  {
    src: "https://scontent.ftun10-1.fna.fbcdn.net/v/t39.30808-6/481479182_489084597605698_8375274233123931950_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=sZeRX8y5tl4Q7kNvwGNTP_D&_nc_oc=AdnCl9n1Mb8nCcYZS6xhkhJxhBP9JHHg3wollROHgbicpmR_uxMGfT8kP5uTvZG5GIU&_nc_zt=23&_nc_ht=scontent.ftun10-1.fna&_nc_gid=PP_L6zJmg-8E3p4C6VwZGg&oh=00_AfLAd6SlCkNGZrWzHJ4o5A2EwkbYIWJ0vIY3B9BEg_7owA&oe=682B2F57",
    alt: "Historical landmark with mountains in background",
    caption: "Our preservation site in the mountains, circa 1923"
  },
  {
    src: "https://scontent.ftun10-2.fna.fbcdn.net/v/t39.30808-6/484583121_495487693632055_4157865217247624157_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=oEO8Z4pFQnwQ7kNvwHJ060s&_nc_oc=AdnEKJw6eXao7bX1rzURHw98CSwl6B4x4dOIxdXwwb3xJNigAdAE5CX9fyCcIOcoTgc&_nc_zt=23&_nc_ht=scontent.ftun10-2.fna&_nc_gid=_RU7qJtjH25UjjSYqh77PA&oh=00_AfJwIbEezYw1iLyevfeHnFRXqplHr6IiYBnOzGuArnwIrQ&oe=682B236F",
    alt: "History is alive here!",
    caption: "History is alive here!"
  },
  {
    src: "https://scontent.ftun10-1.fna.fbcdn.net/v/t39.30808-6/481781870_488993204281504_3842935024160584440_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=IqTNwYEHFYwQ7kNvwGKmoKy&_nc_oc=AdmYTkizVdfj03eB1oNYLP2vRkyp9wxELZBJMWWeW9Ksm-0OzAWNXtBkpfmxR2YPlSk&_nc_zt=23&_nc_ht=scontent.ftun10-1.fna&_nc_gid=ufIBs8dfHmpSxVzY9I7jNw&oh=00_AfIfceXW9GLWsAqGmeitUH5HQPE62ZVmmuvcKLxCQXb8bw&oe=682B2300",
    alt: "Traditional architectural buildings",
    caption: "Cultural heritage buildings preserved by our foundation"
  },
];

// Our Rich History Section
export const RICH_HISTORY = {
  image: "https://scontent.ftun10-1.fna.fbcdn.net/v/t39.30808-6/481781870_488993204281504_3842935024160584440_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=IqTNwYEHFYwQ7kNvwGKmoKy&_nc_oc=AdmYTkizVdfj03eB1oNYLP2vRkyp9wxELZBJMWWeW9Ksm-0OzAWNXtBkpfmxR2YPlSk&_nc_zt=23&_nc_ht=scontent.ftun10-1.fna&_nc_gid=ufIBs8dfHmpSxVzY9I7jNw&oh=00_AfIfceXW9GLWsAqGmeitUH5HQPE62ZVmmuvcKLxCQXb8bw&oe=682B2300",
  alt: "Historical museum building",
  paragraphs: [
    "Founded in 1895, our institution has been at the forefront of preserving and showcasing the rich cultural heritage of our region. Through careful conservation, research, and education, we connect the past with the present for future generations.",
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
