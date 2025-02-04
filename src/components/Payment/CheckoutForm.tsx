"use client";
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslations } from "next-intl";

//http://localhost:3000/?payment_intent=
// payment_intent_client_secret=
// redirect_status=succeeded

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations("Checkout");
  const returnUrl = `${apiUrl || "notDefinedUrl"}/payment-result`;
  console.log("returnUrl: ", returnUrl);

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  //eslint-disable-next-line
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else {
      console.log("error payment intent: ", error);
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="flex justify-center my-4">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="btn btn-success"
        >
          <span id="button-text">
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              t("button")
            )}
          </span>
        </button>
      </div>
      {/* Show any error or success messages */}
      {/* {message && <div id="payment-message">{message}</div>} */}
      {message && (
        <div className="alert alert-error mt-4">
          <div className="flex-1">
            <label>{message}</label>
          </div>
        </div>
      )}
    </form>
  );
}
