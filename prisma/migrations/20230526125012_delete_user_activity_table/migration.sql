/*
  Warnings:

  - You are about to drop the `UserActivities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserActivities" DROP CONSTRAINT "UserActivities_activityId_fkey";

-- DropForeignKey
ALTER TABLE "UserActivities" DROP CONSTRAINT "UserActivities_userId_fkey";

-- DropTable
DROP TABLE "UserActivities";
