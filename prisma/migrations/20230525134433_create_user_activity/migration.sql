-- CreateTable
CREATE TABLE "UserActivities" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "activityId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserActivities" ADD CONSTRAINT "UserActivities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserActivities" ADD CONSTRAINT "UserActivities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
