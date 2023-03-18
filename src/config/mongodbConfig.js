import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.MONGODB_URL;

if (!DB_URL) {
  throw new Error("Please define the DB_URL environment variable inside .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    cached.promise = mongoose.connect(DB_URL, options).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
