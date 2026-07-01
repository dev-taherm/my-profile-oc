import { type SiteProfileData } from "@/lib/profile";

interface JsonLdProps {
  profile?: SiteProfileData;
}

export function JsonLd({ profile }: JsonLdProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: profile?.name || "Taher Mahram",
    url: profile?.url || "https://taher.pixovagency.com",
    logo: `${profile?.url || "https://taher.pixovagency.com"}/images/logo.png`,
    description: profile?.description || "Software Engineer",
    founder: {
      "@type": "Person",
      name: profile?.name || "Taher Mahram",
    },
    sameAs: [
      profile?.github,
      profile?.linkedin,
      profile?.instagram,
      profile?.facebook,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: profile?.email || "tahermahram0@gmail.com",
      availableLanguage: ["English", "Arabic"],
    },
  };

  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile?.name || "Taher Mahram",
    url: profile?.url || "https://taher.pixovagency.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${profile?.url || "https://taher.pixovagency.com"}/en/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Taher Mahram",
    url: profile?.url || "https://taher.pixovagency.com",
    jobTitle: profile?.title || "Software Engineer",
    description: profile?.description || "Software Engineer",
    email: profile?.email || "tahermahram0@gmail.com",
    address: profile?.location ? {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    } : undefined,
    knowsAbout: profile?.skillCategories.flatMap((sc) => sc.skills) || [
      "Python", "Django", "JavaScript", "TypeScript", "PostgreSQL", "REST APIs", "Microservices", "LLMs", "AI Systems", "Docker",
    ],
    hasOccupation: profile?.experiences.map((exp) => ({
      "@type": "Occupation",
      name: exp.role,
      occupationLocation: { "@type": "Organization", name: exp.company },
    })),
    alumniOf: profile?.educations.map((edu) => ({
      "@type": "CollegeOrUniversity",
      name: edu.institution,
      educationalCredentialAward: edu.degree,
    }))[0] || {
      "@type": "CollegeOrUniversity",
      name: "Universiti Teknikal Malaysia Melaka (UTeM)",
    },
    sameAs: [
      profile?.github,
      profile?.linkedin,
      profile?.instagram,
      profile?.facebook,
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile?.name || "Taher Mahram",
    url: profile?.url || "https://taher.pixovagency.com",
    description: profile?.description || "Software Engineer",
    author: {
      "@type": "Person",
      name: profile?.name || "Taher Mahram",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".hero-name", ".hero-title"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
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
