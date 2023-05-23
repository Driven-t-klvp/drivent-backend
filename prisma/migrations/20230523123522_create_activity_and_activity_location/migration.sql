-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "fullActivityAccess" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "startsAt" TIMESTAMPTZ(0) NOT NULL,
    "endsAt" TIMESTAMPTZ(0) NOT NULL,
    "name" TEXT NOT NULL,
    "openSeats" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "ActivityLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityToTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_startsAt_locationId_key" ON "Activity"("startsAt", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToTicket_AB_unique" ON "_ActivityToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToTicket_B_index" ON "_ActivityToTicket"("B");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "ActivityLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLocation" ADD CONSTRAINT "ActivityLocation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToTicket" ADD CONSTRAINT "_ActivityToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToTicket" ADD CONSTRAINT "_ActivityToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
