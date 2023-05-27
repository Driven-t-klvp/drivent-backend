import { Activity, ActivityLocation, Event } from '@prisma/client';
import faker from '@faker-js/faker';

export function getActivityLocations(eventId: number) {
  const locations = ['Auditório Principal', 'Auditório Lateral', 'Sala de Workshop'];

  return locations.map((name) => ({ name, eventId }));
}

export function createActivities(activityLocations: ActivityLocation[], event: Event) {
  const locationsId = activityLocations.map((e) => e.id);

  const eventDays = createDaysArray(event.startsAt, event.endsAt);

  const activitiesArray: Omit<Activity, 'id'>[] = [];

  eventDays.forEach((day) => {
    const betweenFourAndEight = getRandomNumber(4, 8);

    let i = 0;

    while (i < betweenFourAndEight) {
      const name = faker.name.jobArea();
      const openSeats = getRandomNumber(10, 20, true);
      const randomLocationId = locationsId[getRandomNumber(0, locationsId.length - 1)];
      const startHour = getDateTime(day);
      const hourInMillis = getHours();
      const endHour = new Date(startHour.getTime() + hourInMillis);

      const isExistConflict = activitiesArray.find(
        (activity) =>
          activity.locationId === randomLocationId &&
          ((startHour < activity.endsAt && startHour >= activity.startsAt) ||
            (endHour < activity.endsAt && endHour > activity.startsAt)),
      );

      if (isExistConflict) continue;

      if (
        !activitiesArray.some(
          (activity) =>
            activity.startsAt.getUTCDate() === new Date(day).getUTCDate() &&
            activity.locationId === randomLocationId &&
            activity.startsAt.getUTCHours() === 9,
        )
      ) {
        const initialActivityHour = getDateTime(day, true);

        activitiesArray.push({
          startsAt: initialActivityHour,
          endsAt: new Date(initialActivityHour.getTime() + hourInMillis),
          name,
          locationId: randomLocationId,
          openSeats,
        });
      } else {

        activitiesArray.push({
          startsAt: startHour,
          endsAt: endHour,
          name,
          locationId: randomLocationId,
          openSeats,
        });
      }

      i++;
    }
  });

  return activitiesArray;
}

function getRandomNumber(min: number, max: number, containsZero = false): number {
  if (containsZero) {
    return Math.random() * 10 < 2 ? 0 : getRandomNumber(min, max);
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getZeroOrThirtyMinutesInMillis() {
  return Math.random() * 10 < 5 ? 0 : 30 * 60 * 1000;
}

function getHours() {
  return faker.datatype.number({ min: 1, max: 2 }) * 60 * 60 * 1000 + getZeroOrThirtyMinutesInMillis();
}

function getDateTime(day: Date, firstNine = false) {
  const newHour = day.setUTCHours(firstNine ? 9 : faker.datatype.number({ min: 10, max: 15 }), 0, 0, 0);
  return new Date(newHour);
}

function createDaysArray(startsAt: Date, endsAt: Date) {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const daysArray = [];

  const dayInMillis = 24 * 60 * 60 * 1000;

  let currentDate = startDate;
  while (currentDate <= endDate) {
    daysArray.push(currentDate);

    currentDate = new Date(currentDate.getTime() + dayInMillis);
  }

  return daysArray;
}
