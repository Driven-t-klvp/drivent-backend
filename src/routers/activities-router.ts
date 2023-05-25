import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  listActivities,
  listActivityLocations,
  subscribeActivity,
  unsubscribeActivity,
} from '@/controllers/activities-contoller';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', listActivities)
  .post('/', subscribeActivity)
  .delete('/userActivity/:id', unsubscribeActivity)
  .get('/locations', listActivityLocations);

export { activitiesRouter };
