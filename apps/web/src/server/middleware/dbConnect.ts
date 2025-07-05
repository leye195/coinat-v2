import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any;
}

export function dbConnect() {
  const db = mongoose.connection;

  if (db.readyState >= 1) return;

  db.on('error', console.error);
  db.once('open', () => {
    console.log(`Connected to mongodb server`);
  });
  mongoose.set('strictQuery', false);

  return mongoose.connect(process.env.NEXT_PUBLIC_DB!);
}

export default async function dbMiddleware(req: any, res: any, next: any) {
  try {
    if (!global.mongoose) {
      global.mongoose = dbConnect();
    }
  } catch (e) {
    console.error(e);
  }
  return next();
}
