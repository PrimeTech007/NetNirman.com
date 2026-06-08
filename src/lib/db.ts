import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectDB(): Promise<typeof mongoose | null> {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set — skipping DB connection");
    return null;
  }

  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}

export default connectDB;
