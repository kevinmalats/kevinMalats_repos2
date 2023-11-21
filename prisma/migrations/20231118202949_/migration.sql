/*
  Warnings:

  - You are about to drop the `Tickets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Tickets";

-- CreateTable
CREATE TABLE "Ticket" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
