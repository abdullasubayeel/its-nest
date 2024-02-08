/*
  Warnings:

  - You are about to drop the column `User` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_User_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "User",
ADD COLUMN     "managerId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
