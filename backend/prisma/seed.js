import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const plans = [
    { plan_id: 1, plan_name: "School Mid Term", 
        desc:"Cover sessions half yearly exams. Fundamental building, Orientation, Syllabus", 
        duration:"6 months", price:30000, sessionsIncluded:120 },
    { plan_id: 2, plan_name: "School Full Term", 
        desc:"Cover sessions half yearly exams. Fundamentals, Orientation, Syllabus, Project", 
        duration:"12 months", price:48000, sessionsIncluded:240 },
    { plan_id: 3, plan_name: "College Mid Term", 
        desc:"Covers all syllabus till half yearly exams. Fundamental building, Orientation, Syllabus", 
        duration:"6 months", price:36000, sessionsIncluded:120 },
    { plan_id: 4, plan_name: "College Full Term", 
        desc:"Covers all syllabus till half yearly exams. Fundamentals, Orientation, Syllabus, Project, DSA", 
        duration:"12 months", price:52000, sessionsIncluded:240 },

  ];

  for (const plan of plans) {
    await prisma.planDesc.upsert({
      where: { plan_id: plan.plan_id }, // must match unique field
      update: {},
      create: plan,
    });
  }

  console.log("✅ Plans seeded successfully");
}

main()
  .then(() => {
    console.log("Seeding finished ✅");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
