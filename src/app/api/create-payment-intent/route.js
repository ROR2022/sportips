//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";
import { NextResponse } from "next/server";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (data) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  console.log("data Payment:", data);
  const { pkg } = data;
  const amount = pkg.amount;
  console.log("Amount:", amount);
  return amount;
};

export async function POST(req) {
  try {
    const data = await req.json();

    const dataDescription = {
      user: data.user,
      pkgDescription: data.pkg.description,
      questions: data.pkg.questions,
    };

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(data),
      currency: "usd",
      description: JSON.stringify(dataDescription),
      // In the latest version of the API, specifying the `automatic_payment_methods` 
      // parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const clientSecret = paymentIntent.client_secret;
    console.log("paymentIntent: ", paymentIntent);
    const dataPayment = {
      user: data.user,
      amount: paymentIntent.amount/100,
      currency: paymentIntent.currency,
      pkgDescription: data.pkg.description,
      questions: data.pkg.questions,
      paymentIntent: paymentIntent.id,
      paymentResult: "Payment Intent: created",
    };
    const resultPaymentIntent = await axios.post(
      `${process.env.API_URL}/api/payment`,
      dataPayment
    );

    console.log("resultPaymentIntent: ", resultPaymentIntent.data);
    
    return NextResponse.json({ clientSecret }, { status: 200 });
  } catch (error) {
    console.error(
      "Error al obtener la respuesta de stripe:",
      error
    );
    return NextResponse.json(
      {
        error:
          error.response?.data?.error?.message ||
          "Failed to get response from stripe",
      },
      { status: 500 }
    );
  }
}
