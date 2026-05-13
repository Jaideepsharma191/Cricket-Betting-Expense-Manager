import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

// Initialize the Google OAuth Client
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }

    // Securely verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    await dbConnect();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // User doesn't exist, create a new one automatically
      user = await User.create({
        email,
        username: name || email.split("@")[0],
        googleId,
        authProvider: "google",
        profilePic: picture,
        role: "user",
      });
    } else {
      // If user exists (maybe from local signup), link their Google account
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePic = user.profilePic || picture;
        await user.save();
      }
    }

    // Generate our system's custom JWT token
    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    // Set standard secure authentication cookie
    const response = NextResponse.json(
      { message: "Google login successful", redirect: "/dashboard" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
