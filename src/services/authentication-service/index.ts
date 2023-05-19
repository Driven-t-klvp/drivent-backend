import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { invalidCredentialsError } from './errors';
import { exclude } from '@/utils/prisma-utils';
import userRepository from '@/repositories/user-repository';
import sessionRepository from '@/repositories/session-repository';
import { request } from '@/utils/request';

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function signInGitHub(code: string): Promise<SignInResult> {
  if (!code) throw invalidCredentialsError();

  const accessToken = await getAccessTokenFromCodeOrFail(code);

  const userData = await fetchUserOrFail(accessToken);

  const user = await createUserIfNotExist(userData.node_id);

  const token = await createSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
}

async function getAccessTokenFromCodeOrFail(code: string) {
  const GITHUB_ACCSESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';

  const {
    GH_OAUTH_CLIENT_ID: client_id,
    GH_OAUTH_CLIENT_SECRET: client_secret,
    GH_OAUTH_REDIRECT_URL: redirect_uri,
  } = process.env;

  const body = {
    code,
    grant_type: 'authorization_code',
    redirect_uri,
    client_id,
    client_secret,
  };

  const headers = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  const { data } = await request.post(GITHUB_ACCSESS_TOKEN_URL, body, headers);

  const accessToken = new URLSearchParams(data).get('access_token');

  if (!accessToken) throw invalidCredentialsError();

  return accessToken;
}

async function fetchUserOrFail(access_token: string) {
  const response = await request.get('http://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.data) throw invalidCredentialsError();

  return response.data;
}

async function createUserIfNotExist(gitHubId: string) {
  const user = await userRepository.findByGitHubId(gitHubId);

  return user ? user : userRepository.create({ gitHubId });
}

export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

const authenticationService = {
  signIn,
  signInGitHub,
};

export default authenticationService;
export * from './errors';
