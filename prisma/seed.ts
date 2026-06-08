import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!adminEmail) {
    console.error("ADMIN_EMAIL environment variable is required. Set it in .env");
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Taher Mahram",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${admin.email}`);

  const backendCategory = await prisma.category.upsert({
    where: { slug: "backend" },
    update: {},
    create: { slug: "backend", name: "Backend" },
  });

  const aiCategory = await prisma.category.upsert({
    where: { slug: "ai-llm" },
    update: {},
    create: { slug: "ai-llm", name: "AI / LLM" },
  });

  await prisma.category.upsert({
    where: { slug: "full-stack" },
    update: {},
    create: { slug: "full-stack", name: "Full-Stack" },
  });

  await prisma.category.upsert({
    where: { slug: "devops" },
    update: {},
    create: { slug: "devops", name: "DevOps" },
  });

  const tagsData = [
    "Python", "Django", "FastAPI", "PostgreSQL", "Docker", "AWS",
    "React", "Next.js", "LangChain", "RAG", "Microservices", "TypeScript",
    "REST API", "WebSockets", "Celery", "CI/CD",
  ];

  const tags = [];
  for (const name of tagsData) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { slug, name },
    });
    tags.push(tag);
  }

  const aiProject = await prisma.project.upsert({
    where: { slug: "ai-business-assistant" },
    update: {},
    create: {
      slug: "ai-business-assistant",
      featured: true,
      status: "PUBLISHED",
      order: 1,
      categories: { connect: [{ id: aiCategory.id }, { id: backendCategory.id }] },
      tags: {
        connect: tags
          .filter((t) => ["python", "django", "langchain", "rag"].includes(t.slug))
          .map((t) => ({ id: t.id })),
      },
      translations: {
        create: [
          {
            locale: "en",
            title: "AI Business Assistant — RAG Prototype",
            description: "Architected a Retrieval-Augmented Generation (RAG) system using Django and LangChain to enable semantic search over business documents.",
            content: "## Overview\n\nThis project involved building a production-grade RAG system that enables semantic search over business documents using natural language queries.\n\n## Key Features\n\n- **Semantic Search**: Leveraged LangChain chains and retrievers for intelligent document retrieval\n- **Vector Storage**: Implemented Chroma vector store for efficient similarity search\n- **Human-in-the-Loop**: Designed approval workflows for AI-generated actions\n- **Safety First**: Implemented output validation, confidence scoring, and prompt versioning to mitigate hallucinations\n\n## Tech Stack\n\n- Django / Python\n- LangChain (Chains, Retrievers)\n- Chroma Vector Database\n- OpenAI API\n- Prompt Engineering & Guardrails",
          },
          {
            locale: "ar",
            title: "مساعد الأعمال بالذكاء الاصطناعي — نموذج RAG",
            description: "تصميم نظام RAG (التوليد المعزز بالاسترجاع) باستخدام Django و LangChain للبحث الدلالي في وثائق الأعمال.",
            content: "## نظرة عامة\n\nهذا المشروع يتعلق بنظام RAG في سير عمل الإنتاج يتيح البحث الدلالي في وثائق الأعمال.\n\n## الميزات الرئيسية\n\n- **البحث الدلالي**: استخدام سلاسل LangChain\n- **تخزين المتجهات**: تنفيذ تخزين Chroma\n- **الإنسان في حلقة التحكم**: تصميم سير عمل الموافقة\n- **السلامة أولاً**: التحقق من المخرجات وتقدير الثقة\n\n## التقنيات\n\n- Django / Python\n- LangChain\n- Chroma Vector Database\n- OpenAI API",
          },
        ],
      },
    },
  });

  const multiTenantProject = await prisma.project.upsert({
    where: { slug: "multi-tenant-sales-distribution" },
    update: {},
    create: {
      slug: "multi-tenant-sales-distribution",
      featured: true,
      status: "PUBLISHED",
      order: 2,
      categories: { connect: [{ id: backendCategory.id }] },
      tags: {
        connect: tags
          .filter((t) => ["python", "django", "postgresql", "microservices", "rest-api"].includes(t.slug))
          .map((t) => ({ id: t.id })),
      },
      translations: {
        create: [
          {
            locale: "en",
            title: "Multi-tenant Sales & Sample Distribution",
            description: "Designed a multi-tenant system to calculate sample quotas based on historical sales data and product rules.",
            content: "## Overview\n\nDesigned and implemented a multi-tenant system for calculating sample quotas based on historical sales data and product-specific rules.\n\n## Key Features\n\n- **Tenant Isolation**: Complete data isolation between tenants\n- **Quota Calculation**: Algorithm-driven sample quota computation\n- **Proposal APIs**: RESTful APIs for managing distribution proposals\n- **Audit Compliance**: Comprehensive audit logs\n\n## Tech Stack\n\n- Django / Python\n- PostgreSQL\n- REST API Design\n- Domain-Driven Design (DDD)\n- Multi-tenancy Architecture",
          },
          {
            locale: "ar",
            title: "نظام المبيعات وتوزيع العينات متعدد المستأجرين",
            description: "تصميم نظام متعدد المستأجرين لحساب حصص العينات بناءً على بيانات المبيعات التاريخية وقواعد المنتجات.",
            content: "## نظرة عامة\n\nتصميم وتنفيذ نظام متعدد المستأجرين لحساب حصص العينات.\n\n## الميزات الرئيسية\n\n- **عزل المستأجرين**: عزل بيانات كامل\n- **حساب الحصص**: خوارزمية محسوبة\n- **واجهات المقترحات**: واجهات REST\n- **الامتثال للتدقيق**: سجلات شاملة\n\n## التقنيات\n\n- Django / Python\n- PostgreSQL\n- REST API Design\n- DDD\n- Multi-tenancy",
          },
        ],
      },
    },
  });

  const blogPost = await prisma.blogPost.upsert({
    where: { slug: "building-rag-systems-production" },
    update: {},
    create: {
      slug: "building-rag-systems-production",
      readingTime: 8,
      featured: true,
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categories: { connect: [{ id: aiCategory.id }] },
      tags: {
        connect: tags
          .filter((t) => ["langchain", "rag", "python"].includes(t.slug))
          .map((t) => ({ id: t.id })),
      },
      translations: {
        create: [
          {
            locale: "en",
            title: "Building RAG Systems for Production",
            excerpt: "Lessons learned from implementing Retrieval-Augmented Generation systems in production environments.",
            content: "## What is RAG?\n\nRetrieval-Augmented Generation (RAG) combines the power of large language models with external knowledge retrieval.\n\n## Key Lessons\n\n1. **Data quality matters more than model size**\n2. **Vector store selection impacts performance significantly**\n3. **Human-in-the-loop is essential for production safety**\n\n## Implementation Tips\n\n- Start with simple chunking strategies\n- Implement confidence scoring early\n- Version your prompts for reproducibility\n- Monitor hallucination rates in production",
          },
          {
            locale: "ar",
            title: "بناء أنظمة RAG للإنتاج",
            excerpt: "دروس مستفادة من تنفيذ أنظمة التوليد المعزز بالاسترجاع في بيئات الإنتاج.",
            content: "## ما هو RAG؟\n\nالتوليد المعزز بالاسترجاع يجمع بين قوة نماذج اللغة الكبيرة واسترجاع المعرفة الخارجية.\n\n## الدروس الرئيسية\n\n1. **جودة البيانات أهم من حجم النموذج**\n2. **اختيار المتجهات يؤثر على الأداء**\n3. **الإنسان في حلقة التحكم ضروري**\n\n## نصائح التنفيذ\n\n- ابدأ ب استراتيجيات التقسيم البسيطة\n- قم بتنفيذ تقدير الثقة مبكراً\n- قم بإصدار أوامرك\n- راقب معدلات الهلوسة",
          },
        ],
      },
    },
  });

  console.log(`Projects: ${aiProject.slug}, ${multiTenantProject.slug}`);
  console.log(`Blog post: ${blogPost.slug}`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
