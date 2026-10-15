export interface RestaurantPolicy {
  id: string;
  title: string;
  shortTitle: string;
  lastUpdated: string;
  content: {
    heading: string;
    text: string[];
  }[];
}

export const RESTAURANT_POLICIES: Record<string, RestaurantPolicy> = {
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy Policy",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Overview & Scope",
        text: [
          "American Coffee Shop ('we', 'us', or 'our'), located at 41 NE 44th St. (Prospect Rd.), Oakland Park, FL 33334, is committed to respecting your privacy. This policy outlines how we handle information collected through our official website and in-restaurant operations.",
          "We do not sell, rent, or trade your personal data to any third-party marketing brokers.",
        ],
      },
      {
        heading: "2. Information We Collect",
        text: [
          "Direct Contact Information: When you call us at +1 (954) 772-8850 or place a takeout order, we collect only the necessary details (such as your name, contact phone number, and special dietary requests) required to prepare and fulfill your food order.",
          "Third-Party Ordering Platforms: When ordering through our authorized partners (Toast Tab, Uber Eats, Grubhub, Postmates, Seamless), transaction details and payment data are securely processed under each respective platform's encrypted payment terms.",
          "Website Usage Data: We may collect anonymous aggregate technical data (browser type, operating system, pages visited) to ensure optimal website responsiveness and performance.",
        ],
      },
      {
        heading: "3. How We Use Your Information",
        text: [
          "To prepare, package, and fulfill takeout, curbside, and delivery food and beverage orders.",
          "To communicate order readiness or clarify specific dietary instructions.",
          "To comply with applicable State of Florida food service regulations and local public health standards.",
        ],
      },
      {
        heading: "4. Data Security & Storage",
        text: [
          "We implement physical, administrative, and technical safeguards to protect any customer information. Payment card numbers are never stored on our physical premises or web servers.",
        ],
      },
      {
        heading: "5. Your Rights & Contact Information",
        text: [
          "You may request access to, correction of, or deletion of your personal contact records by contacting us directly at +1 (954) 772-8850 or visiting our Oakland Park restaurant during normal operating hours.",
        ],
      },
    ],
  },

  terms: {
    id: "terms",
    title: "Terms of Service & Dining Policies",
    shortTitle: "Terms of Service",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Acceptance of Terms",
        text: [
          "By accessing our website or placing food orders with American Coffee Shop, you agree to these Terms of Service. If you do not agree, please refrain from using our digital services.",
        ],
      },
      {
        heading: "2. Menu Pricing",
        text: [
          "Prices are accurate at the time of publication but are subject to change based on seasonal market ingredient costs without prior written notice.",
          "State and local sales taxes (Florida State Sales Tax 6.0% and Broward County local discretionary surtax) apply to all taxable food and beverage items.",
        ],
      },
      {
        heading: "3. Hours & Service Availability",
        text: [
          "Our posted operating hours are Monday–Saturday from 6:30 AM to 3:00 PM, and Sunday from 7:00 AM to 2:00 PM. Kitchen orders close 15 minutes prior to posted closing time.",
          "Certain menu specialties, seasonal fruit shakes, and daily Spanish lunch specials are prepared in limited daily quantities and are subject to availability.",
        ],
      },
      {
        heading: "4. Third-Party Links & Services",
        text: [
          "Our website includes direct links to certified third-party delivery providers (Toast Tab, Uber Eats, Grubhub, Postmates, Seamless, Google Maps). American Coffee Shop is not responsible for the independent terms, delivery fee structures, driver timing, or refund policies of third-party platforms.",
        ],
      },
    ],
  },

  accessibility: {
    id: "accessibility",
    title: "ADA Digital & Physical Accessibility Statement",
    shortTitle: "Accessibility Statement",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Our Commitment to Accessibility",
        text: [
          "American Coffee Shop is committed to providing an accessible and inclusive digital and dining experience for all guests, including individuals with disabilities.",
          "We strive to conform our website with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and comply with the Americans with Disabilities Act (ADA) requirements.",
        ],
      },
      {
        heading: "2. Digital Accessibility Features",
        text: [
          "High contrast color ratios (dark espresso brown and high-luminance lavender/cream text) for enhanced readability.",
          "Keyboard navigation support and structured ARIA attributes across interactive components and modals.",
          "Descriptive alternative text for food photography and responsive layout adaptability for screen zoom up to 200%.",
        ],
      },
      {
        heading: "3. On-Site Physical Accommodations",
        text: [
          "Our Oakland Park diner at 41 NE 44th St. provides wheelchair-accessible parking, entrance ramps, low-barrier counter and table seating, and assistance upon request from our friendly service staff.",
        ],
      },
      {
        heading: "4. Accessibility Assistance & Feedback",
        text: [
          "If you encounter any difficulty accessing any element of our website or need assistance placing an order, our staff will gladly assist you over the phone. Please call us directly at +1 (954) 772-8850 during business hours.",
        ],
      },
    ],
  },

  allergen: {
    id: "allergen",
    title: "FDA Consumer Advisory & Food Allergy Notice",
    shortTitle: "Food Allergy & Health Advisory",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Florida FDA Food Safety Consumer Advisory",
        text: [
          "Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness, especially if you have certain medical conditions.",
          "Eggs and minute steaks may be cooked to order upon customer request (e.g. over easy, medium rare).",
        ],
      },
      {
        heading: "2. Food Allergen Warning",
        text: [
          "Please be advised that food prepared in our kitchen may contain or come into contact with common allergens, including MILK, EGGS, WHEAT/GLUTEN, SOYBEAN, FISH, CRUSTACEAN SHELLFISH, TREE NUTS, and PEANUTS.",
          "While our kitchen adheres to rigorous sanitation standards, shared griddles, fryers, and preparation surfaces are used across our American diner and Spanish specialties.",
        ],
      },
      {
        heading: "3. Special Dietary Requirements",
        text: [
          "If you or anyone in your party has a food allergy or dietary intolerance, please notify our staff when ordering so our culinary team can take all reasonable precautions.",
        ],
      },
    ],
  },

  refund: {
    id: "refund",
    title: "Takeout, Pickup & Refund Policy",
    shortTitle: "Refund & Takeout Policy",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Freshly Made-to-Order Standards",
        text: [
          "Every dish, espresso colada, and pressed Cuban sandwich is made fresh to order. Typical call-in takeout preparation time is 15 to 20 minutes.",
          "Please arrive promptly at your estimated pickup time to ensure optimal temperature, crispness of bread, and coffee crema freshness.",
        ],
      },
      {
        heading: "2. Order Cancellations & Modifications",
        text: [
          "Because food preparation begins immediately upon order placement, cancellations or modifications for phone call-in orders must be communicated within 5 minutes of placing your call.",
          "Orders placed through delivery apps (Uber Eats, Grubhub, Postmates, Seamless) must be cancelled or modified directly through the respective app before kitchen dispatch.",
        ],
      },
      {
        heading: "3. Satisfaction Guarantee & Returns",
        text: [
          "If there is any discrepancy with your order, an item is missing, or a dish does not meet our high culinary standards, please notify our team within 2 hours of pickup at +1 (954) 772-8850.",
          "We will promptly replace the item, offer diner credit, or issue an appropriate refund.",
        ],
      },
    ],
  },

  floridaDisclosure: {
    id: "floridaDisclosure",
    title: "State of Florida Business & Regulatory Disclosure",
    shortTitle: "Florida Regulatory Disclosure",
    lastUpdated: "January 2026",
    content: [
      {
        heading: "1. Entity & Licensing Information",
        text: [
          "Business Name: American Coffee Shop",
          "Subtitles / Trademarks: American & Spanish Restaurant · Home of the Cafe con Leche",
          "Physical Address: 41 NE 44th St. (Prospect Rd.), Oakland Park, FL 33334, USA",
          "County: Broward County, Florida",
          "Regulatory Agency: Division of Hotels and Restaurants, Florida Department of Business and Professional Regulation (DBPR).",
        ],
      },
      {
        heading: "2. Food Safety & Public Health Compliance",
        text: [
          "American Coffee Shop operates in strict compliance with the Florida Sanitary Code (Chapter 509, Florida Statutes) and local Broward County Health Department sanitation guidelines.",
          "All food handlers are trained and certified in commercial food safety handling.",
        ],
      },
    ],
  },
};
