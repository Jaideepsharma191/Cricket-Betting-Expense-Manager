import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function test() {
  try {
    let MONGODB_URI = process.env.MONGODB_URI;
    console.log("Original URI:", MONGODB_URI);
    
    const uriRegex = /^(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.*)$/;
    const match = MONGODB_URI.match(uriRegex);
    if (match) {
      const prefix = match[1];
      let password = match[2];
      const suffix = match[3];
      password = encodeURIComponent(decodeURIComponent(password));
      MONGODB_URI = `${prefix}${password}${suffix}`;
    }
    console.log("Parsed URI:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Try to hash a password
    const hashedPassword = await bcrypt.hash("test@password", 12);
    console.log("Hashed:", hashedPassword);

    console.log("All success");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
