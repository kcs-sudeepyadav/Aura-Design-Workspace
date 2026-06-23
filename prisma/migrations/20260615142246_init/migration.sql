-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "health" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "completion" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "managerId" TEXT,
    "clientId" TEXT,
    CONSTRAINT "Project_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "url" TEXT,
    "projectId" TEXT,
    "uploadedById" TEXT,
    CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "assignee" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "crew" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,
    "photos" TEXT NOT NULL,
    "projectId" TEXT,
    CONSTRAINT "SiteLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "imageUrl" TEXT,
    "projectId" TEXT,
    CONSTRAINT "Approval_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "mine" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ref" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
