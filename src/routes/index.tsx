import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/site/Home";

const title = "American Coffee Shop | American & Spanish Restaurant in Oakland Park, FL";
const description =
  "American Coffee Shop is a beloved American and Spanish restaurant at 41 Prospect Rd, Oakland Park, FL serving authentic Spanish dishes, Tortilla Española, tapas, Cuban coffee, American breakfast favorites and lunch.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "American Coffee Shop",
  servesCuisine: ["American", "Spanish", "Latin", "Cuban"],
  priceRange: "$10–20",
  telephone: "+1-954-772-8850",
  address: {
    "@type": "PostalAddress",
    streetAddress: "41 Prospect Rd",
    addressLocality: "Oakland Park",
    addressRegion: "FL",
    postalCode: "33334",
    addressCountry: "US",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Home,
});
