-- CreateEnum
CREATE TYPE "public"."MentorshipStatus" AS ENUM ('NONE', 'SEEKING_MENTOR', 'OPEN_TO_MENTOR', 'MENTORING');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "achievements" JSONB,
ADD COLUMN     "certifications" JSONB,
ADD COLUMN     "currentOrganization" TEXT,
ADD COLUMN     "currentPosition" TEXT,
ADD COLUMN     "degree" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "interests" JSONB,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "mentorshipStatus" "public"."MentorshipStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "projects" JSONB,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "workExperience" JSONB,
ADD COLUMN     "yearOfStudy" TEXT;
