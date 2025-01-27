"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// POST: Login a user
export async function POST(req) {
  try {
    await dbConnect();
    const {email, password} = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    //user.token = token;
    return NextResponse.json({...user._doc, token}, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to login user" }, { status: 500 });
  }
}


