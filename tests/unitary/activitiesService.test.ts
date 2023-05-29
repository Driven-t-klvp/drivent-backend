import { ActivityLocation, Address, Enrollment, Ticket, TicketType } from '@prisma/client';
import activityRepository from '@/repositories/activity-repository';
import activitiesService from '@/services/activities-service';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

describe('listActivityLocation', () => {
  it('calls the repository to list activity locations and return the value received', async () => {
    jest.spyOn(activityRepository, 'findActivityLocations').mockResolvedValue([{ id: 2 } as ActivityLocation]);

    const result = await activitiesService.listActivityLocation();

    expect(activityRepository.findActivityLocations).toHaveBeenCalledWith();
    expect(result).toEqual([{ id: 2 }]);
  });
});

describe('listActivities', () => {
  const userId = 5;
  const selectedDate = { day: 25, month: 5, year: 2023 };
  let findWithAddressByUserIdSpy: jest.SpyInstance;
  let findTicketByEnrollmentIdSpy: jest.SpyInstance;

  describe('when the user has no enrollments', () => {
    it('rejects to a not found error', async () => {
      jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockRejectedValue(notFoundError());

      const result = activitiesService.listActivities(userId, selectedDate);

      expect(result).rejects.toEqual(notFoundError());
    });
  });

  describe('when the user has a enrollment', () => {
    beforeEach(() => {
      findWithAddressByUserIdSpy = jest
        .spyOn(enrollmentRepository, 'findWithAddressByUserId')
        .mockResolvedValue({ id: 2, Address: {} } as Enrollment & { Address: Address });

      findTicketByEnrollmentIdSpy = jest
        .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
        .mockResolvedValue({ status: 'PAID', TicketType: {} } as Ticket & { TicketType: TicketType });
    });

    describe('when the enrollment has a valid ticket', () => {
      it('resolves to the correct value', async () => {
        const result = await activitiesService.listActivityLocation();

        expect(result).toEqual([]);
      });

      it('calls expected functions', async () => {
        await activitiesService.listActivities(userId, selectedDate);

        expect(findWithAddressByUserIdSpy).toHaveBeenCalledWith(userId);
        expect(findTicketByEnrollmentIdSpy).toHaveBeenCalledWith(2);
      });
    });

    describe('when the enrollment has no valid tickets', () => {
      it('rejects to a not found error', async () => {
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockRejectedValue(notFoundError());
        const result = activitiesService.listActivities(userId, selectedDate);

        await expect(result).rejects.toEqual(notFoundError());
      });
    });
  });
});
