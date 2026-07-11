-- DropForeignKey
ALTER TABLE "ProgressNote" DROP CONSTRAINT "ProgressNote_authorId_fkey";

-- AlterTable
ALTER TABLE "ProgressNote" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
