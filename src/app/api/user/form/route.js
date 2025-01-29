"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import { uploadImage } from "../../../../services/cloudinary";
import fs from "fs";
import path from "path";
import { promisify } from "util"; // Para convertir funciones basadas en callback a promesas

const writeFile = promisify(fs.writeFile); // Convertimos fs.writeFile en una función async

// PUT: Actualizar un usuario con form data (imagen)

export async function PUT(req) {
  try {
    await dbConnect();
    //primero necesito extraer el formData del req
    const formData = await req.formData();

    //ahora necesito ver por consola que contiene el formData
    //console.log("formData: ", formData);

    //necesito extraer el file del formData
    const file = formData.get("file");
    const _id = formData.get("_id");
    const name = formData.get("name");
    const email = formData.get("email");

    if (file) {
      //console.log("route file: ", file);
      //await uploadImage(file, _id);

      // Crear una ruta temporal en el servidor para guardar el archivo
      const tempDir = path.join(process.cwd(), "upload"); // Carpeta 'upload' en el directorio raíz
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir); // Crear la carpeta si no existe
      }

      // Generar un nombre único para el archivo
      const nameWithoutExtension = file.name.split(".")[0];
      const uniqueFilename = `${_id}-${Date.now()}-${nameWithoutExtension}`;
      const tempFilePath = path.join(
        tempDir,
        uniqueFilename
      );

      // Leer el contenido del archivo recibido y guardarlo temporalmente
      const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convertir a Buffer
      await writeFile(tempFilePath, fileBuffer); // Guardar el archivo temporalmente

      console.log("Archivo guardado temporalmente en:", tempFilePath);

      // Enviar el archivo a Cloudinary
      const urlResult = await uploadImage(tempFilePath, uniqueFilename);

      // Una vez que se suba a Cloudinary, puedes eliminar el archivo temporal
      fs.unlinkSync(tempFilePath); // Eliminar el archivo temporal del servidor

      if (urlResult) {
        console.log("urlResult: ", urlResult);
        // Actualizar los datos del usuario
        const tempDataUser = {
          name,
          email,
          imageUrl: urlResult,
        };
        const user = await User.findByIdAndUpdate(_id, tempDataUser, {new: true});
        return NextResponse.json(user, { status: 200 });
      }
    }

    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
