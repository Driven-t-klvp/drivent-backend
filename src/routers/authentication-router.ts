import { Router } from 'express';
import { singInGitHub, singInPost } from '@/controllers';
import { validateBody } from '@/middlewares';
import { signInSchema } from '@/schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost).post('/sign-in/github', singInGitHub);

export { authenticationRouter };
