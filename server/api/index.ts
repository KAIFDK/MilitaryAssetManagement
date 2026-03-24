import { NowRequest, NowResponse } from '@vercel/node';
import app from '../src/index';

export default function handler(req: NowRequest, res: NowResponse) {
  return app(req, res);
}
