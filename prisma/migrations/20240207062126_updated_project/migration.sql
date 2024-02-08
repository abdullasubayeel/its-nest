/*
  Warnings:

  - You are about to drop the column `managerId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_managerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "managerId",
ADD COLUMN     "User" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_User_fkey" FOREIGN KEY ("User") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
