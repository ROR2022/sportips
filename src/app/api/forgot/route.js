"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
//import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";
import { generateRandomCode } from "@/services/libAux";
import { sendRecoveryPasswordMailer } from "@/services/libMailer";


// Get: Enviar un email con un código de recuperación

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
    
        if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
    
        const user = await User.findOne({ email });
        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    
        const recoveryCode = generateRandomCode();
        user.activationCode = recoveryCode;
        user.active = false;
        await user.save();
        await sendRecoveryPasswordMailer(email, recoveryCode);
    
        return NextResponse.json({ message: "Recovery code sent" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to send recovery code" }, { status: 500 });
    }
    }




