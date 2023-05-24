import { Activity } from '@prisma/client';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { QueryDate } from '@/protocols';

async function listActivities(userId: number, selectedDate: QueryDate) {
  if (!selectedDate) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.fullActivityAccess) {
    throw cannotListHotelsError();
  }

  const minDate = getDateAccordinglyTime(selectedDate, 0, 0, 0);
  const maxDate = getDateAccordinglyTime(selectedDate, 23, 59, 59);

  const activities = await activityRepository.findActivitiesByDate(minDate, maxDate);

  if (!activities.length) throw notFoundError();

  const activitiesDividedByLocation = getActivitiesByLocations(activities);

  return activitiesDividedByLocation;
}

async function listActivityLocation() {
  return activityRepository.findActivityLocations();
}

function getDateAccordinglyTime({ year, day, month }: QueryDate, hour: number, minute: number, seconds: number) {
  return new Date(Date.UTC(year, month, day, hour, minute, seconds, 0));
}

function getActivitiesByLocations(activities: Activity[]) {
  const hash: any = {};
  activities.forEach((e) =>
    hash[e.locationId] ? (hash[e.locationId] = [...hash[e.locationId], e]) : (hash[e.locationId] = [e]),
  );

  return hash;
}

export default { listActivities, listActivityLocation };
