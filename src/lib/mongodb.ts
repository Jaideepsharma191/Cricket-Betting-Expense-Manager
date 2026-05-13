import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Safely encode the password if it contains special characters like '@'
const uriRegex = /^(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.*)$/;
const match = MONGODB_URI.match(uriRegex);
if (match) {
  const prefix = match[1];
  let password = match[2];
  const suffix = match[3];
  
  try {
    // Decode first to prevent double-encoding, then encode safely
    password = encodeURIComponent(decodeURIComponent(password));
    MONGODB_URI = `${prefix}${password}${suffix}`;
  } catch (error) {
    // Fallback to original if parsing fails
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
