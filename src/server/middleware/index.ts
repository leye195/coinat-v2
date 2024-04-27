import type { NextApiRequest } from 'next';
import nextConnect from 'next-connect';
import { NextApiResponseServerIO } from '@/types/Socket';
import dbMiddleware from './dbConnect';

export default function createHandler(...args: any[]) {
  return nextConnect<NextApiRequest, NextApiResponseServerIO>().use(
    dbMiddleware,
    ...args,
  );
}
