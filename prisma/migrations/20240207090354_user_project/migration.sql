/*
  Warnings:

  - You are about to drop the `_developers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_developers" DROP CONSTRAINT "_developers_A_fkey";

-- DropForeignKey
ALTER TABLE "_developers" DROP CONSTRAINT "_developers_B_fkey";

-- DropTable
DROP TABLE "_developers";

-- CreateTable
CREATE TABLE "UserProjects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "UserProjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProjects_userId_projectId_key" ON "UserProjects"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjects" ADD CONSTRAINT "UserProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
