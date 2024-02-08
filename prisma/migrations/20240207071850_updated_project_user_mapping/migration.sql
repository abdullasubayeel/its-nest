/*
  Warnings:

  - Made the column `managerId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_managerId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "managerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_developers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_developers_AB_unique" ON "_developers"("A", "B");

-- CreateIndex
CREATE INDEX "_developers_B_index" ON "_developers"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_developers" ADD CONSTRAINT "_developers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_developers" ADD CONSTRAINT "_developers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
