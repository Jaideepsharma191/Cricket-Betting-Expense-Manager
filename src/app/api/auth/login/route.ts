import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    // Set the cookie directly on the response object
    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error?.message || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
