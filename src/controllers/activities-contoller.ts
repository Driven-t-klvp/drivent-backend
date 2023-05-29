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

export async function subscribeActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { activityId } = req.body;

  try {
    const ticketActivity = await activitiesService.subscribeActivity({ userId, activityId });
    return res.status(httpStatus.OK).send(ticketActivity);
  } catch (error) {
    next(error);
  }
}

export async function unsubscribeActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { id } = req.params;
  const activityId = parseInt(id);

  try {
    await activitiesService.unsubscribeActivity({ userId, activityId });
    return res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

export async function listUserActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const ticketActivity = await activitiesService.listUserActivities(userId);
    return res.status(httpStatus.OK).send(ticketActivity);
  } catch (error) {
    next(error);
  }
}
