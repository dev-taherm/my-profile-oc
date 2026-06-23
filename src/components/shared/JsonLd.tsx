import { siteConfig } from "@/lib/constants";

export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Software Engineer",
    description: siteConfig.description,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sana'a",
      addressCountry: "YE",
    },
    knowsAbout: [
      "Python",
      "Django",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "SQLite",
      "REST APIs",
      "Microservices",
      "LLMs",
      "AI Systems",
      "RAG Pipelines",
      "LangChain",
      "Docker",
      "Linux",
      "Git",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universiti Teknikal Malaysia Melaka (UTeM)",
      department: "Faculty of Information and Communication Technology",
    },
    sameAs: [
      siteConfig.github,
      siteConfig.linkedin,
      siteConfig.instagram,
      siteConfig.facebook,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
