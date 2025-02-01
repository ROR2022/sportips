"use server";
import dbConnect from "@/db/db";
import { NextResponse } from "next/server";
import Payment from "@/db/models/Payment";
import axios from "axios";

// GET: Obtener todos los pagos o un pago por id
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Buscar un pago por id
      const payment = await Payment.findById(id);
      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(payment, { status: 200 });
    } else {
      // Obtener todos los pagos
      const payments = await Payment.find({});
      return NextResponse.json(payments, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo pago
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const payment = await Payment.create(data);
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un pago
export async function PUT(req) {
  try {
    await dbConnect();
    const dataTemp = await req.json();
    const { paymentIntent, ...restData } = dataTemp;
    /* const payment = await Payment.findByIdAndUpdate(_id, restData, {
      new: true,
    }); */
    //find payment by paymentIntent and update
    const payment = await Payment.findOneAndUpdate(
      { paymentIntent },
      restData,
      { new: true }
    );
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (payment.paymentResult === "succeeded") {
      //extraer el user del payment para actualizar el questionsBuyed
      const user = payment.user;
      const questionsBuyedNow = payment.questions;
      const userFind = await axios.get(
        `${process.env.API_URL}/api/user?id=${user}`
      );
      const questionsBuyed = userFind.data.questionsBuyed + questionsBuyedNow;
      const userUpdate = await axios.put(`${process.env.API_URL}/api/user`, {
        _id: user,
        questionsBuyed,
      });
      console.log("userUpdate: ", userUpdate.data);
    }

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un pago
export async function DELETE(req) {
  try {
    await dbConnect();
    const { id } = await req.json();
    await Payment.findByIdAndDelete(id);
    return NextResponse.json({ message: "Payment deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
