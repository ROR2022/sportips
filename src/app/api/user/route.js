"use server";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendConfimCodeMailer } from "@/services/libMailer";
import { generateRandomCode } from "@/services/libAux";
import { getAllUsers, getOneUserByEmail, getOneUserById, createUser, updateUser, deleteUser } from "./service";
//import { uploadImage } from "../../../services/cloudinary";


// GET: Obtener todos los usuarios o un usuario por email
export async function GET(req) {
  try {
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");
    console.log('getDataUser email: ', email);
    console.log('getDataUser userId: ', userId);

    if (email) {
      // Buscar un usuario por email
      const user = await getOneUserByEmail(email);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } else if (userId) {
      // Buscar un usuario por id
      const user = await getOneUserById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }

      // Obtener todos los usuarios
      const users = await getAllUsers();
      return NextResponse.json(users, { status: 200 });
    
  } catch (error) {
    console.error('Error getDataUser: ', error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Crear un nuevo usuario
export async function POST(req) {
  try {
    
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    data.activationCode = generateRandomCode();
    data.questionsFree = 5;
    const user = await createUser(data);
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
    
    const dataTemp = await req.json();
    console.log('dataTemp: ',dataTemp);
    const { _id, ...restData } = dataTemp;
    

    const user = await updateUser(_id, restData);
    return NextResponse.json(user, { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Eliminar un usuario
export async function DELETE(req) {
  try {
    
    const { id } = await req.json();
    await deleteUser(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
