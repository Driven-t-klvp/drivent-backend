/*
  Warnings:

  - Added the required column `openSeats` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "openSeats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "fullActivityAccess" BOOLEAN NOT NULL DEFAULT false;
