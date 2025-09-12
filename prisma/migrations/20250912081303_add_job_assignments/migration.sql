-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('SUBMITTED', 'REVIEWED', 'REFERRED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."JobAssignment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "assignmentType" TEXT NOT NULL,
    "skillsRequired" JSONB,
    "attachmentUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobSubmission" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "submissionText" TEXT,
    "attachmentUrl" TEXT,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNotes" TEXT,
    "referralCompany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobAssignment_createdById_idx" ON "public"."JobAssignment"("createdById");

-- CreateIndex
CREATE INDEX "JobSubmission_studentId_idx" ON "public"."JobSubmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSubmission_assignmentId_studentId_key" ON "public"."JobSubmission"("assignmentId", "studentId");

-- AddForeignKey
ALTER TABLE "public"."JobAssignment" ADD CONSTRAINT "JobAssignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobSubmission" ADD CONSTRAINT "JobSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."JobAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobSubmission" ADD CONSTRAINT "JobSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
