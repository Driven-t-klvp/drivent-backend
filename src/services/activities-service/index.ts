import { Activity } from '@prisma/client';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';
import { QueryDate } from '@/protocols';
import { forBiddenError } from '@/errors/forbidden-error';

async function listActivities(userId: number, selectedDate: QueryDate) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.fullActivityAccess) {
    throw cannotListHotelsError(); // bora criar um erro novo :eyes:
  }

  const minDate = getDateAccordinglyTime(selectedDate, 0, 0, 0);
  const maxDate = getDateAccordinglyTime(selectedDate, 23, 59, 59);

  const activities = await activityRepository.findActivitiesByDate(minDate, maxDate, enrollment.id);

  // if (!activities.length) throw notFoundError(); // isso nao deveria ser um erro ne, so uma lista vazia

  const activitiesDividedByLocation = getActivitiesByLocations(activities);

  return activitiesDividedByLocation;
}

async function listActivityLocation() {
  return activityRepository.findActivityLocations();
}

async function subscribeActivity({ userId, activityId }: { userId: number; activityId: number }) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  const { openSeats, startsAt, endsAt } = activity;

  if (openSeats <= 0) throw forBiddenError();

  const possibleConflictActivities = await activityRepository.searchConflicTicketActivities(
    startsAt,
    endsAt,
    enrollment.id,
  );

  const hasconflict = possibleConflictActivities.find((e) => e.Tickets.length > 0);
  if (hasconflict) throw forBiddenError();

  await activityRepository.reduceActivitySeats(activityId);
  const ticketActivity = await activityRepository.createTicketActivity(ticket.id, activityId);

  return ticketActivity;
}
async function unsubscribeActivity({ userId, activityId }: { userId: number; activityId: number }) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const activity = await activityRepository.findActivityById(activityId);
  if (!activity) throw notFoundError();

  const ticketActivity = await activityRepository.findTicketActivity(ticket.id, activityId);
  if (ticketActivity.Tickets.length <= 0) throw notFoundError();

  await activityRepository.deleteTicketActivity(ticket.id, activityId);
  await activityRepository.incrementActivitySeats(activityId);

  return;
}

function getDateAccordinglyTime({ year, day, month }: QueryDate, hour: number, minute: number, seconds: number) {
  return new Date(Date.UTC(year, month, day, hour, minute, seconds, 0));
}

function getActivitiesByLocations(activities: Array<Activity & { Tickets: Array<{ id: number }> }>) {
  const hash: any = {};
  activities.forEach((e) =>
    hash[e.locationId] ? (hash[e.locationId] = [...hash[e.locationId], e]) : (hash[e.locationId] = [e]),
  );

  return hash;
}

const activitiesService = { listActivities, listActivityLocation, subscribeActivity, unsubscribeActivity };

export default activitiesService;
