-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "roles" "Roles" NOT NULL,
    "refreshToken" TEXT,
    "managerId" INTEGER,
    "projectsAssigned" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "managerId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignee" INTEGER NOT NULL,
    "reporter" INTEGER NOT NULL,
    "issueType" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignee_fkey" FOREIGN KEY ("assignee") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_reporter_fkey" FOREIGN KEY ("reporter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
