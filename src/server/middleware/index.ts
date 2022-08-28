import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import dbMiddleware from "./dbConnect";

export default function createHandler(...args: any[]) {
  return nextConnect<NextApiRequest, NextApiResponse>().use(
    dbMiddleware,
    ...args
  );
}
