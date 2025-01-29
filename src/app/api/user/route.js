"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendConfimCodeMailer } from "@/services/libMailer";
import { generateRandomCode } from "@/services/libAux";
import { uploadImage } from "../../../services/cloudinary";


// GET: Obtener todos los usuarios o un usuario por email
export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      // Buscar un usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } else {
      // Obtener todos los usuarios
      const users = await User.find({});
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Crear un nuevo usuario
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    data.activationCode = generateRandomCode();
    const user = await User.create(data);
    await sendConfimCodeMailer(data.email, data.activationCode);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT: Actualizar un usuario
export async function PUT(req) {
  try {
    await dbConnect();
    const dataTemp = await req.json();
    console.log('dataTemp: ',dataTemp);
    const { _id, ...restData } = dataTemp;
    

    const user = await User.findByIdAndUpdate(_id, restData, { new: true });
    return NextResponse.json(user, { status: 200 });
    //return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Eliminar un usuario
export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
