-- CreateEnum
CREATE TYPE "public"."ConsultStatus" AS ENUM ('TAKEN', 'DEMANDED', 'NOT_TAKEN');

-- CreateTable
CREATE TABLE "public"."Auth" (
    "auth_id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."StAccount" (
    "s_id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "StAccount_pkey" PRIMARY KEY ("s_id")
);

-- CreateTable
CREATE TABLE "public"."Specialization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TAccount" (
    "t_id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "rating" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "TAccount_pkey" PRIMARY KEY ("t_id")
);

-- CreateTable
CREATE TABLE "public"."PlanDesc" (
    "plan_id" INTEGER NOT NULL,
    "plan_name" TEXT NOT NULL,
    "desc" TEXT,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sessionsIncluded" INTEGER NOT NULL,

    CONSTRAINT "PlanDesc_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "public"."PlanRecord" (
    "record_no" SERIAL NOT NULL,
    "s_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "joinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionsRem" INTEGER NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "payCheck" BOOLEAN NOT NULL DEFAULT false,
    "consultStat" "public"."ConsultStatus" NOT NULL DEFAULT 'NOT_TAKEN',

    CONSTRAINT "PlanRecord_pkey" PRIMARY KEY ("record_no")
);

-- CreateTable
CREATE TABLE "public"."ClassRecord" (
    "record_no" SERIAL NOT NULL,
    "t_id" INTEGER NOT NULL,
    "s_id" INTEGER NOT NULL,
    "plan_record_id" INTEGER NOT NULL,
    "link" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),

    CONSTRAINT "ClassRecord_pkey" PRIMARY KEY ("record_no")
);

-- CreateTable
CREATE TABLE "public"."_TeacherSpecs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TeacherSpecs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_mail_key" ON "public"."Auth"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "StAccount_uid_key" ON "public"."StAccount"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "public"."Specialization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TAccount_uid_key" ON "public"."TAccount"("uid");

-- CreateIndex
CREATE INDEX "_TeacherSpecs_B_index" ON "public"."_TeacherSpecs"("B");

-- AddForeignKey
ALTER TABLE "public"."StAccount" ADD CONSTRAINT "StAccount_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."Auth"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TAccount" ADD CONSTRAINT "TAccount_uid_fkey" FOREIGN KEY ("uid") REFERENCES "public"."Auth"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanRecord" ADD CONSTRAINT "PlanRecord_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "public"."StAccount"("s_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanRecord" ADD CONSTRAINT "PlanRecord_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."PlanDesc"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassRecord" ADD CONSTRAINT "ClassRecord_t_id_fkey" FOREIGN KEY ("t_id") REFERENCES "public"."TAccount"("t_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassRecord" ADD CONSTRAINT "ClassRecord_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "public"."StAccount"("s_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassRecord" ADD CONSTRAINT "ClassRecord_plan_record_id_fkey" FOREIGN KEY ("plan_record_id") REFERENCES "public"."PlanRecord"("record_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeacherSpecs" ADD CONSTRAINT "_TeacherSpecs_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeacherSpecs" ADD CONSTRAINT "_TeacherSpecs_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."TAccount"("t_id") ON DELETE CASCADE ON UPDATE CASCADE;
