import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { listActivities, listActivityLocations } from '@/controllers/activities-contoller';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).get('/', listActivities).get('/locations', listActivityLocations);

export { activitiesRouter };
