import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;

// Define User schema like in the app
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  googleId: { type: String, sparse: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User2", UserSchema); // use User2 to avoid interference just in case

async function test() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Try to create a user
    const hashedPassword = await bcrypt.hash("test@password", 12);
    
    // First user
    const user1 = await User.create({
      username: "testuser1",
      email: "test1@example.com",
      password: hashedPassword,
      role: "user"
    });
    console.log("Created user1", user1._id);

    // Second user
    const user2 = await User.create({
      username: "testuser2",
      email: "test2@example.com",
      password: hashedPassword,
      role: "user"
    });
    console.log("Created user2", user2._id);

    // cleanup
    await User.deleteMany({ email: { $in: ["test1@example.com", "test2@example.com"] } });
    console.log("All success");
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
