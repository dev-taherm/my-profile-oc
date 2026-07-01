import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getSiteProfile, invalidateProfileCache } from "@/lib/profile";

export async function GET() {
  try {
    const profile = await getSiteProfile();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/site-profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      name, title, description, url, email, phone, whatsapp, location,
      github, linkedin, instagram, facebook, twitterHandle,
      heroGreeting, heroSubtitle, heroDescription,
      aboutSummary, aboutMission, resumeSummary,
      statsExperience, statsProjects, statsTech, statsCerts,
      experiences, educations, skillCategories, certifications, languages,
    } = body;

    if (!name || !title || !description || !url || !email) {
      return NextResponse.json({ error: "Name, title, description, url, and email are required" }, { status: 400 });
    }

    const profileData = {
      name,
      title,
      description,
      url,
      email,
      phone: phone || null,
      whatsapp: whatsapp || null,
      location: location || null,
      github: github || null,
      linkedin: linkedin || null,
      instagram: instagram || null,
      facebook: facebook || null,
      twitterHandle: twitterHandle || null,
      heroGreeting: heroGreeting || null,
      heroSubtitle: heroSubtitle || null,
      heroDescription: heroDescription || null,
      aboutSummary: aboutSummary || null,
      aboutMission: aboutMission || null,
      resumeSummary: resumeSummary || null,
      statsExperience: statsExperience || null,
      statsProjects: statsProjects || null,
      statsTech: statsTech || null,
      statsCerts: statsCerts || null,
    };

    await prisma.siteProfile.upsert({
      where: { id: "default" },
      update: profileData,
      create: { id: "default", ...profileData },
    });

    if (Array.isArray(experiences)) {
      await prisma.experienceEntry.deleteMany({ where: { profileId: "default" } });
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        await prisma.experienceEntry.create({
          data: {
            company: exp.company,
            role: exp.role,
            period: exp.period,
            highlights: JSON.stringify(exp.highlights || []),
            order: exp.order ?? i + 1,
            profileId: "default",
          },
        });
      }
    }

    if (Array.isArray(educations)) {
      await prisma.educationEntry.deleteMany({ where: { profileId: "default" } });
      for (let i = 0; i < educations.length; i++) {
        const edu = educations[i];
        await prisma.educationEntry.create({
          data: {
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location || null,
            period: edu.period,
            order: edu.order ?? i + 1,
            profileId: "default",
          },
        });
      }
    }

    if (Array.isArray(skillCategories)) {
      await prisma.skillCategory.deleteMany({ where: { profileId: "default" } });
      for (let i = 0; i < skillCategories.length; i++) {
        const sc = skillCategories[i];
        await prisma.skillCategory.create({
          data: {
            title: sc.title,
            icon: sc.icon || null,
            skills: JSON.stringify(sc.skills || []),
            order: sc.order ?? i + 1,
            profileId: "default",
          },
        });
      }
    }

    if (Array.isArray(certifications)) {
      await prisma.certification.deleteMany({ where: { profileId: "default" } });
      for (let i = 0; i < certifications.length; i++) {
        const cert = certifications[i];
        await prisma.certification.create({
          data: {
            title: cert.title,
            issuer: cert.issuer || null,
            year: cert.year || null,
            order: cert.order ?? i + 1,
            profileId: "default",
          },
        });
      }
    }

    if (Array.isArray(languages)) {
      await prisma.language.deleteMany({ where: { profileId: "default" } });
      for (let i = 0; i < languages.length; i++) {
        const lang = languages[i];
        await prisma.language.create({
          data: {
            name: lang.name,
            level: lang.level,
            order: lang.order ?? i + 1,
            profileId: "default",
          },
        });
      }
    }

    invalidateProfileCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/site-profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
