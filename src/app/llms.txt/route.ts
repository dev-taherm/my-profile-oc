import { getSiteProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getSiteProfile();

  const lines: string[] = [];
  lines.push(`# ${profile.name} — ${profile.title}`);
  lines.push("");
  lines.push("## About");
  lines.push(profile.description);
  lines.push("");

  if (profile.skillCategories.length > 0) {
    lines.push("## Expertise");
    for (const cat of profile.skillCategories) {
      lines.push(`- ${cat.title}: ${cat.skills.join(", ")}`);
    }
    lines.push("");
  }

  if (profile.experiences.length > 0) {
    lines.push("## Experience");
    for (const exp of profile.experiences) {
      lines.push(`- ${exp.role} at ${exp.company} — ${exp.period}`);
    }
    lines.push("");
  }

  if (profile.educations.length > 0) {
    lines.push("## Education");
    for (const edu of profile.educations) {
      const loc = edu.location ? `, ${edu.location}` : "";
      lines.push(`${edu.degree} — ${edu.institution}${loc}, ${edu.period}`);
    }
    lines.push("");
  }

  lines.push("## Key Facts");
  if (profile.location) lines.push(`- Based in ${profile.location}`);
  if (profile.languages.length > 0) {
    lines.push(`- Speaks ${profile.languages.map((l) => `${l.name} (${l.level})`).join(" and ")}`);
  }
  lines.push("- Available for remote and freelance work");
  lines.push("");

  lines.push("## Pages");
  lines.push(`- Home: ${profile.url}/en`);
  lines.push(`- About: ${profile.url}/en/about`);
  lines.push(`- Services: ${profile.url}/en/services`);
  lines.push(`- Projects: ${profile.url}/en/projects`);
  lines.push(`- Blog: ${profile.url}/en/blog`);
  lines.push(`- Resume: ${profile.url}/en/resume`);
  lines.push(`- Contact: ${profile.url}/en/contact`);
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Website: ${profile.url}`);
  lines.push(`- Email: ${profile.email}`);
  if (profile.whatsapp) lines.push(`- WhatsApp: ${profile.whatsapp}`);
  if (profile.github) lines.push(`- GitHub: ${profile.github}`);
  if (profile.linkedin) lines.push(`- LinkedIn: ${profile.linkedin}`);

  const content = lines.join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
