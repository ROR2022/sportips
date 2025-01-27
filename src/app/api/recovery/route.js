"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// POST: Verificar el código de recuperación y cambiar la contraseña

const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/;


export async function POST(req) {
  try {
    await dbConnect();
    const { email, code, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    // Validar la contraseña
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be between 8 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter, and one special character",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.activationCode !== code) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    // Cambiar la contraseña
    user.password = await bcrypt.hash(password, 10);
    user.active = true;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send recovery code" },
      { status: 500 }
    );
  }
}
