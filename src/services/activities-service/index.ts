import { Activity } from '@prisma/client';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { QueryDate } from '@/protocols';
import { forBiddenError } from '@/errors/forbidden-error';

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

  const activities = await activityRepository.findActivitiesByDate(minDate, maxDate, userId);

  if (!activities.length) throw notFoundError();

  const activitiesDividedByLocation = getActivitiesByLocations(activities);

  return activitiesDividedByLocation;
}

async function listActivityLocation() {
  return activityRepository.findActivityLocations();
}

async function subscribeActivity({ userId, activityId }: { userId: number; activityId: number }) {
  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  if (activity.openSeats <= 0) throw forBiddenError();

  await activityRepository.reduceActivitySeats(activityId);
  const userActivity = await activityRepository.createUserActivity(userId, activityId);

  return userActivity;
}
async function unsubscribeActivity({ userId, activityId }: { userId: number; activityId: number }) {
  const userActivity = await activityRepository.findUserActivity(userId, activityId);
  if (!userActivity) throw notFoundError();

  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  await activityRepository.deleteUserActivity(userActivity.id);
  await activityRepository.incrementActivitySeats(activityId);

  return;
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

export default { listActivities, listActivityLocation, subscribeActivity, unsubscribeActivity };
