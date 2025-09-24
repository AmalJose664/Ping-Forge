-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventCategoryId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCategoryId_fkey" FOREIGN KEY ("eventCategoryId") REFERENCES "EventCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
