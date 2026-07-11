-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REGISTERED_NURSE', 'CARE_MANAGER', 'ADMIN', 'CARER');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT');

-- CreateEnum
CREATE TYPE "CareLevel" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "AdmissionType" AS ENUM ('Permanent', 'Respite');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "NoteCategory" AS ENUM ('clinical', 'personal_care', 'behaviour', 'incident');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "CarePlanStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "WoundStatus" AS ENUM ('active', 'healing', 'healed', 'archived');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Medicare_Card', 'IHI_Card', 'Concession_Card', 'DVA_Card');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('Active', 'Verified', 'Pending', 'NA');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('Completed', 'Scheduled');

-- CreateEnum
CREATE TYPE "PathwayStatus" AS ENUM ('Not_Started', 'In_Progress', 'Completed');

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'ap-southeast-2',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "shift" "Shift",
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preferredName" TEXT,
    "room" TEXT NOT NULL,
    "dateOfAdmission" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT,
    "admissionType" "AdmissionType" NOT NULL DEFAULT 'Permanent',
    "onLeave" BOOLEAN NOT NULL DEFAULT false,
    "careLevel" "CareLevel" NOT NULL DEFAULT 'Medium',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'Active',
    "diagnosis" TEXT NOT NULL,
    "ihi" TEXT,
    "medicareCard" TEXT,
    "concessionNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressNote" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "NoteCategory" NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'Medium',
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completedBy" TEXT,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedBy" TEXT,
    "completedAt" TEXT,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlan" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "interventions" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "CarePlanStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wound" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "startedDate" TIMESTAMP(3) NOT NULL,
    "onAdmission" BOOLEAN NOT NULL DEFAULT false,
    "woundType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dressingProduct" TEXT,
    "nextDressing" TIMESTAMP(3),
    "lastReview" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "status" "WoundStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "Wound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentDoctor" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "facilityName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResidentDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "number" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL,
    "detail" TEXT,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalReading" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "pulse" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "spo2" INTEGER NOT NULL,

    CONSTRAINT "VitalReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "by" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'Completed',

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnaccDetail" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "fundingClass" TEXT NOT NULL,
    "fundingLevel" "CareLevel" NOT NULL,
    "dailyRate" TEXT NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "nextReview" TIMESTAMP(3) NOT NULL,
    "domainScores" JSONB NOT NULL,
    "ihiNumber" TEXT NOT NULL,
    "ihiVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AnaccDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePathway" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalSteps" INTEGER NOT NULL,
    "completedSteps" INTEGER NOT NULL,
    "status" "PathwayStatus" NOT NULL DEFAULT 'Not_Started',

    CONSTRAINT "CarePathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "storageKey" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "ipHash" TEXT,
    "metadata" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE INDEX "Staff_facilityId_idx" ON "Staff"("facilityId");

-- CreateIndex
CREATE INDEX "Resident_facilityId_idx" ON "Resident"("facilityId");

-- CreateIndex
CREATE INDEX "Allergy_facilityId_residentId_idx" ON "Allergy"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "ProgressNote_facilityId_residentId_idx" ON "ProgressNote"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Task_facilityId_residentId_idx" ON "Task"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Checklist_facilityId_residentId_idx" ON "Checklist"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "ChecklistItem_checklistId_idx" ON "ChecklistItem"("checklistId");

-- CreateIndex
CREATE INDEX "CarePlan_facilityId_residentId_idx" ON "CarePlan"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Wound_facilityId_residentId_idx" ON "Wound"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Movement_facilityId_residentId_idx" ON "Movement"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "ResidentDoctor_facilityId_residentId_idx" ON "ResidentDoctor"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Contact_facilityId_residentId_idx" ON "Contact"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Card_facilityId_residentId_idx" ON "Card"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "VitalReading_facilityId_residentId_idx" ON "VitalReading"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Assessment_facilityId_residentId_idx" ON "Assessment"("facilityId", "residentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnaccDetail_residentId_key" ON "AnaccDetail"("residentId");

-- CreateIndex
CREATE INDEX "AnaccDetail_facilityId_idx" ON "AnaccDetail"("facilityId");

-- CreateIndex
CREATE INDEX "CarePathway_facilityId_residentId_idx" ON "CarePathway"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "Document_facilityId_residentId_idx" ON "Document"("facilityId", "residentId");

-- CreateIndex
CREATE INDEX "AuditLog_facilityId_at_idx" ON "AuditLog"("facilityId", "at");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wound" ADD CONSTRAINT "Wound_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentDoctor" ADD CONSTRAINT "ResidentDoctor_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalReading" ADD CONSTRAINT "VitalReading_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaccDetail" ADD CONSTRAINT "AnaccDetail_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePathway" ADD CONSTRAINT "CarePathway_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
