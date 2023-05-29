import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  listActivities,
  listActivityLocations,
  subscribeActivity,
  unsubscribeActivity,
  listUserActivities,
} from '@/controllers/activities-contoller';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', listActivities)
  .post('/', subscribeActivity)
  .delete('/ticketActivity/:id', unsubscribeActivity)
  .get('/locations', listActivityLocations)
  .get('/myActivities', listUserActivities);

export { activitiesRouter };
