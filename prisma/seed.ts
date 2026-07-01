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
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // Seed default profile
  const existingProfile = await prisma.siteProfile.findUnique({ where: { id: "default" } });
  if (!existingProfile) {
    console.log("Seeding default profile...");
    await prisma.siteProfile.create({
      data: {
        id: "default",
        name: "Taher Mahram",
        title: "Software Engineer",
        description:
          "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows.",
        url: "https://taher.pixovagency.com",
        email: "tahermahram0@gmail.com",
        phone: "+967 779991263",
        whatsapp: "+967733918465",
        location: "Sana'a, Yemen",
        github: "https://github.com/dev-taherm",
        linkedin: "https://www.linkedin.com/in/taher-mahram/",
        instagram: "https://instagram.com/dev_taher",
        facebook: "https://www.facebook.com/taher.ali.moharam",
        twitterHandle: "@dev_taher",
        heroGreeting: "Hello, I'm",
        heroSubtitle: "Building scalable architectures and integrating LLMs into production workflows.",
        heroDescription:
          "I design and build robust backend systems, AI-powered applications, and cloud-native architectures. With over 3 years of experience in Python, Django, and LLM engineering, I help businesses transform ideas into production-ready software that scales.",
        aboutSummary:
          "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows. Strong background in Django-based platforms, multi-tenant systems, and audit-safe business processes. Experienced with Agile delivery, cloud-native concepts, and building systems that serve real users with measurable impact.",
        aboutMission:
          "My mission is to leverage technology to solve real-world problems, building systems that are not only technically sound but also deliver measurable business value.",
        resumeSummary:
          "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows. Strong background in Django-based platforms, multi-tenant systems, and audit-safe business processes. Experienced with Agile delivery, cloud-native concepts, and building systems that serve real users with measurable impact.",
        statsExperience: "3+",
        statsProjects: "10+",
        statsTech: "15+",
        statsCerts: "3+",
        experiences: {
          create: [
            {
              company: "Neo Platrix (Hopofy)",
              role: "Software Engineer",
              period: "Jan 2024 – Present",
              highlights: JSON.stringify([
                "Led the design of the core product backend, building scalable REST APIs (Django/PostgreSQL) that serve 100+ active users with backward-compatible versioning.",
                "Modeled complex business workflows with strict audit trails and Role-Based Access Control (RBAC), reducing manual processing time by 40%.",
                "Implemented Django Channels and WebSockets to handle thousands of monthly events and real-time notifications.",
                "Championed AI-assisted pipelines, including prompt templates, validation guardrails for AI-generated code, and automated suggestion features.",
                "Introduced structured logging, rate limiting, and standard error-handling patterns to improve system observability and stability under load.",
              ]),
              order: 1,
            },
            {
              company: "Pixova Agency",
              role: "Founder & Software Engineer",
              period: "Nov 2022 – Dec 2023",
              highlights: JSON.stringify([
                "Led end-to-end architecture and delivery for client-facing web products, managing the lifecycle from UI/UX mockups to deployment.",
                "Delivered custom WordPress solutions and full-stack web applications, owning hosting configurations and SEO optimizations.",
                "Implemented developer-friendly Git workflows, testing protocols, and CI practices to reduce delivery friction and improve code quality.",
              ]),
              order: 2,
            },
            {
              company: "Khebrat Technology",
              role: "Web Application Developer Intern",
              period: "Mar 2022 – Aug 2022",
              highlights: JSON.stringify([
                "Built workflow management applications to automate internal processes, utilizing Node.js and Firebase for the backend.",
                "Developed responsive frontends using HTML, CSS, and Bootstrap, ensuring cross-device compatibility.",
              ]),
              order: 3,
            },
          ],
        },
        educations: {
          create: [
            {
              degree: "B.Sc. in Computer Science (Software Development), with Honors",
              institution: "Universiti Teknikal Malaysia Melaka (UTeM)",
              location: "Malaysia",
              period: "2018–2022",
              order: 1,
            },
          ],
        },
        skillCategories: {
          create: [
            {
              title: "Backend & Systems",
              icon: "Code",
              skills: JSON.stringify(["Python", "Django", "DRF", "FastAPI", "Microservices", "System Design", "DDD", "Multi-tenancy", "RBAC", "REST API"]),
              order: 1,
            },
            {
              title: "AI & LLM Engineering",
              icon: "Brain",
              skills: JSON.stringify(["LangChain", "RAG Pipelines", "Chroma", "FAISS", "OpenAI", "Prompt Engineering", "Guardrails"]),
              order: 2,
            },
            {
              title: "Cloud & DevOps",
              icon: "Cloud",
              skills: JSON.stringify(["AWS", "Docker", "CI/CD", "Celery", "Rate Limiting", "Observability"]),
              order: 3,
            },
            {
              title: "Frontend & Data",
              icon: "Palette",
              skills: JSON.stringify(["PostgreSQL", "MySQL", "Firebase", "React", "Next.js", "HTML5", "CSS3", "Tailwind"]),
              order: 4,
            },
          ],
        },
        certifications: {
          create: [
            { title: "LLM & AI Systems (Self-study: LangChain, RAG Pipelines)", order: 1 },
            { title: "Udemy: LLM Engineering & LangChain Courses", issuer: "Udemy", order: 2 },
          ],
        },
        languages: {
          create: [
            { name: "Arabic", level: "Native", order: 1 },
            { name: "English", level: "Professional", order: 2 },
          ],
        },
      },
    });
    console.log("Default profile seeded.");
  } else {
    console.log("Profile already exists, skipping seed.");
  }

  // Seed sample data only if SEED_DEMO=true
  const seedDemo = process.env.SEED_DEMO === "true";
  if (!seedDemo) {
    console.log("Skipping demo data (set SEED_DEMO=true to include).");
    console.log("Seeding complete!");
    return;
  }

  console.log("Seeding demo data...");

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

  const servicesData = [
    {
      slug: "backend-development",
      icon: "Code",
      order: 1,
      translations: [
        {
          locale: "en",
          title: "Backend Development",
          shortDesc: "Scalable REST APIs, system architecture, and database design using Django, FastAPI, and PostgreSQL.",
          description: "## Backend Development\n\nI build robust, scalable backend systems that handle real-world traffic and complex business logic.\n\n## What I Deliver\n\n- RESTful API design with Django REST Framework or FastAPI\n- Database schema design and optimization (PostgreSQL, MySQL)\n- Authentication & authorization (JWT, RBAC, OAuth)\n- Background task processing with Celery\n- Real-time features with Django Channels & WebSockets\n- API versioning and backward compatibility\n\n## Tech Stack\n\n- Python / Django / FastAPI\n- PostgreSQL / MySQL\n- Redis / Celery\n- Docker",
          features: "REST API Design & Development\nDatabase Schema Design & Optimization\nAuthentication & Authorization (JWT, RBAC)\nBackground Task Processing (Celery)\nReal-time Systems (WebSockets)\nAPI Versioning & Documentation",
        },
        {
          locale: "ar",
          title: "تطوير الأنظمة الخلفية",
          shortDesc: "واجهات برمجة تطبيقات REST القابلة للتوسع وتصميم هندسة المعمارية وقواعد البيانات باستخدام Django و FastAPI و PostgreSQL.",
          description: "## تطوير الأنظمة الخلفية\n\nأبني أنظمة خلفية قوية وقابلة للتوسع تتعامل مع حركة المرور الحقيقية ومنطق الأعمال المعقد.\n\n## ما أقدمه\n\n- تصميم واجهات برمجة تطبيقات REST باستخدام Django REST Framework أو FastAPI\n- تصميم وتحسين قواعد البيانات (PostgreSQL, MySQL)\n- المصادقة والتفويض (JWT, RBAC, OAuth)\n- معالجة المهام في الخلفية مع Celery\n- الميزات الفورية مع Django Channels و WebSockets\n- إصدارات واجهات البرمجة والتوافق مع الإصدارات السابقة\n\n## التقنيات\n\n- Python / Django / FastAPI\n- PostgreSQL / MySQL\n- Redis / Celery\n- Docker",
          features: "تصميم وتطوير واجهات REST\nتصميم وتحسين قواعد البيانات\nالمصادقة والتفويض (JWT, RBAC)\nمعالجة المهام في الخلفية (Celery)\nالأنظمة الفورية (WebSockets)\nإصدارات وتوثيق واجهات البرمجة",
        },
      ],
    },
    {
      slug: "ai-llm-integration",
      icon: "Brain",
      order: 2,
      translations: [
        {
          locale: "en",
          title: "AI & LLM Integration",
          shortDesc: "RAG systems, intelligent chatbots, prompt engineering, and production AI pipelines.",
          description: "## AI & LLM Integration\n\nI integrate cutting-edge AI capabilities into production workflows, with a focus on safety and reliability.\n\n## What I Deliver\n\n- RAG (Retrieval-Augmented Generation) systems\n- Vector database integration (Chroma, FAISS)\n- Prompt engineering and versioning\n- Output validation and hallucination mitigation\n- Human-in-the-loop workflows\n- AI-powered automation features\n\n## Tech Stack\n\n- LangChain / LlamaIndex\n- OpenAI / Open-source LLMs\n- Chroma / FAISS\n- Python / Django",
          features: "RAG System Design & Implementation\nVector Database Integration (Chroma, FAISS)\nPrompt Engineering & Versioning\nHallucination Mitigation & Guardrails\nHuman-in-the-Loop Workflows\nAI-Powered Automation",
        },
        {
          locale: "ar",
          title: "تكامل الذكاء الاصطناعي ونماذج اللغة الكبيرة",
          shortDesc: "أنظمة RAG والروبوتات الذكية وهندسة الأوامر وسير عمل الذكاء الاصطناعي للإنتاج.",
          description: "## تكامل الذكاء الاصطناعي ونماذج اللغة الكبيرة\n\nأدمج قدرات الذكاء الاصطناعي المتطورة في سير عمل الإنتاج مع التركيز على السلامة والموثوقية.\n\n## ما أقدمه\n\n- أنظمة RAG (التوليد المعزز بالاسترجاع)\n- تكامل قواعد بيانات المتجهات (Chroma, FAISS)\n- هندسة الأوامر وإصدارها\n- التحقق من المخرجات وتقليل الهلوسة\n- سير عمل الإنسان في حلقة التحكم\n- ميزات الأتمتة بالذكاء الاصطناعي\n\n## التقنيات\n\n- LangChain / LlamaIndex\n- OpenAI / نماذج مفتوحة المصدر\n- Chroma / FAISS\n- Python / Django",
          features: "تصميم وتنفيذ أنظمة RAG\nتكامل قواعد بيانات المتجهات (Chroma, FAISS)\nهندسة الأوامر وإصدارها\ntaقليل الهلوسة والتحقق\nسير عمل الإنسان في حلقة التحكم\nالأتمتة بالذكاء الاصطناعي",
        },
      ],
    },
    {
      slug: "full-stack-web-apps",
      icon: "Layers",
      order: 3,
      translations: [
        {
          locale: "en",
          title: "Full-Stack Web Apps",
          shortDesc: "End-to-end web applications with modern frontends and robust backends.",
          description: "## Full-Stack Web Apps\n\nI deliver complete web applications from concept to deployment, handling both frontend and backend.\n\n## What I Deliver\n\n- Modern React/Next.js frontends\n- Server-side rendering and static generation\n- Responsive UI with Tailwind CSS\n- State management and data fetching\n- Integration with backend APIs\n- Deployment and hosting setup\n\n## Tech Stack\n\n- React / Next.js\n- TypeScript\n- Tailwind CSS\n- Vercel / AWS",
          features: "React / Next.js Frontend Development\nServer-Side Rendering & Static Generation\nResponsive UI with Tailwind CSS\nTypeScript Integration\nAPI Integration & State Management\nDeployment & Hosting",
        },
        {
          locale: "ar",
          title: "تطبيقات الويب الكاملة",
          shortDesc: "تطبيقات ويب متكاملة من الواجهة الأمامية إلى الخلفية.",
          description: "## تطبيقات الويب الكاملة\n\nأقدم تطبيقات ويب متكاملة من المفهوم إلى النشر، وأتعامل مع الواجهة الأمامية والخلفية.\n\n## ما أقدمه\n\n- واجهات أمامية حديثة مع React/Next.js\n- العرض من جانب الخادم والتصنيف الثابت\n- واجهات متجاوبة مع Tailwind CSS\n- إدارة الحالة وجلب البيانات\n- التكامل مع واجهات برمجة الخلفية\n- إعداد النشر والاستضافة\n\n## التقنيات\n\n- React / Next.js\n- TypeScript\n- Tailwind CSS\n- Vercel / AWS",
          features: "تطوير واجهات React / Next.js\nالعرض من جانب الخلفية والتصنيف الثابت\nواجهات متجاوبة مع Tailwind CSS\ntaكامل TypeScript\ntaكامل إدارة الحالة وواجهات البرمجة\nالنشر والاستضافة",
        },
      ],
    },
    {
      slug: "cloud-devops",
      icon: "Cloud",
      order: 4,
      translations: [
        {
          locale: "en",
          title: "Cloud & DevOps",
          shortDesc: "Docker, AWS deployment, CI/CD pipelines, and infrastructure automation.",
          description: "## Cloud & DevOps\n\nI set up reliable cloud infrastructure and deployment pipelines for production applications.\n\n## What I Deliver\n\n- Docker containerization and orchestration\n- AWS deployment (EC2, RDS, S3)\n- CI/CD pipeline setup (GitHub Actions)\n- Infrastructure as Code\n- Monitoring and observability\n- Performance optimization\n\n## Tech Stack\n\n- Docker / Docker Compose\n- AWS (EC2, RDS, S3)\n- GitHub Actions\n- Nginx / Caddy",
          features: "Docker Containerization\nAWS Deployment (EC2, RDS, S3)\nCI/CD Pipelines (GitHub Actions)\nInfrastructure as Code\nMonitoring & Observability\nPerformance Optimization",
        },
        {
          locale: "ar",
          title: "السحابة وعمليات التطوير",
          shortDesc: "Docker ونشر AWS وخطوط CI/CD وأتمتة البنية التحتية.",
          description: "## السحابة وعمليات التطوير\n\nأقوم بإعداد بنية تحتية سحابية موثوقة وخطوط نشر للتطبيقات الإنتاجية.\n\n## ما أقدمه\n\n- حاويات Docker والتنسيق\n- نشر AWS (EC2, RDS, S3)\n- إعداد خطوط CI/CD (GitHub Actions)\n- البنية التحتية كشفرة\n- المراقبة والملاحظة\n- تحسين الأداء\n\n## التقنيات\n\n- Docker / Docker Compose\n- AWS (EC2, RDS, S3)\n- GitHub Actions\n- Nginx / Caddy",
          features: "حاويات Docker\nنشر AWS (EC2, RDS, S3)\nخطوط CI/CD (GitHub Actions)\nالبنية التحتية كشفرة\nالمراقبة والملاحظة\nتحسين الأداء",
        },
      ],
    },
    {
      slug: "technical-consulting",
      icon: "Search",
      order: 5,
      translations: [
        {
          locale: "en",
          title: "Technical Consulting",
          shortDesc: "Architecture audits, code reviews, and technical advisory for your team.",
          description: "## Technical Consulting\n\nI help teams make better technical decisions through architecture reviews and hands-on advisory.\n\n## What I Deliver\n\n- Architecture review and recommendations\n- Code quality audits\n- Performance bottleneck identification\n- Technology stack evaluation\n- Team mentoring and knowledge transfer\n- Technical documentation\n\n## Ideal For\n\n- Startups building their first product\n- Teams scaling existing systems\n- Projects needing a fresh technical perspective",
          features: "Architecture Review & Recommendations\nCode Quality Audits\nPerformance Bottleneck Analysis\nTechnology Stack Evaluation\nTeam Mentoring & Knowledge Transfer\nTechnical Documentation",
        },
        {
          locale: "ar",
          title: "الاستشارات التقنية",
          shortDesc: "مراجعات الهندسة المعمارية ومراجعة الكود والاستشارات التقنية لفريقك.",
          description: "## الاستشارات التقنية\n\nأساعد الفرق في اتخاذ قرارات تقنية أفضل من خلال مراجعات الهندسة المعمارية والاستشارات العملية.\n\n## ما أقدمه\n\n- مراجعة الهندسة المعمارية والتوصيات\n- تدقيقات جودة الكود\n- تحديد عوائق الأداء\n- تقييم التقنيات المستخدمة\n- تدريب الفريق ونقل المعرفة\n- التوثيق التقني\n\n## مناسب لـ\n\n- الشركات الناشئة التي تبني منتجها الأول\n- الفرق التي توسع أنظمتها الحالية\n- المشاريع التي تحتاج منظوراً تقنياً جديداً",
          features: "مراجعة الهندسة المعمارية والتوصيات\nتدقيقات جودة الكود\nتحليل عوائق الأداء\ntaقييم التقنيات المستخدمة\nتدريب الفريق ونقل المعرفة\nالتوثيق التقني",
        },
      ],
    },
  ];

  for (const serviceData of servicesData) {
    await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: {},
      create: {
        slug: serviceData.slug,
        icon: serviceData.icon,
        featured: true,
        status: "PUBLISHED",
        order: serviceData.order,
        translations: {
          create: serviceData.translations,
        },
      },
    });
  }

  console.log(`Projects: ${aiProject.slug}, ${multiTenantProject.slug}`);
  console.log(`Blog post: ${blogPost.slug}`);
  console.log(`Services: ${servicesData.map((s) => s.slug).join(", ")}`);
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
