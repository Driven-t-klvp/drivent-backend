import axios from 'axios';
import { requestError } from '@/errors';

async function get(url: string, headers = {}) {
  try {
    const result = await axios.get(url, headers);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

async function post(url: string, body: unknown, headers: unknown) {
  try {
    const result = await axios.post(url, body, headers);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

export const request = {
  get,
  post,
};
