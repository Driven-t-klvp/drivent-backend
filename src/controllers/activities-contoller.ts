import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';
import { QueryDate } from '@/protocols';

export async function listActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  const selectedDate = req.query as QueryDate;

  try {
    const activities = await activitiesService.listActivities(userId, selectedDate);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function listActivityLocations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const activityLocations = await activitiesService.listActivityLocation();
    return res.status(httpStatus.OK).send(activityLocations);
  } catch (error) {
    next(error);
  }
}
