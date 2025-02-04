"use client";
import React, { Suspense, useEffect, useState, FC } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  loadStripe,
  StripeElementsOptions,
  Appearance,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocalStorage } from "usehooks-ts";
import { IDataUser } from "../Activation/Activation";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);



interface GetPkgSelectedProps {
  setPkgSelected: (pkg: string) => void;
}

const GetPkgSelected: FC<GetPkgSelectedProps> = ({ setPkgSelected }) => {
  const searchParams = useSearchParams();
  const pkgSelected = searchParams.get("pkg");

  useEffect(() => {
    if (pkgSelected) {
      setPkgSelected(pkgSelected);
    }
  }, [pkgSelected]);

  return null;
};

type TDataPackage = {
  id: string;
  name: string;
  price: string;
  description: string;
  questions: number;
  amount: number;
};

const dataPackages = [
  {
    id: "1",
    name: "Basic",
    price: "$5.00 USD",
    description: "Basic package 50 questions",
    questions: 50,
    amount: 500,
  },
  {
    id: "2",
    name: "Premium",
    price: "$10.00 USD",
    description: "Premium package 100 questions",
    questions: 100,
    amount: 1000,
  },
];

const Payment = () => {
    const t = useTranslations("Payment");
  const [pkgSelected, setPkgSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  const [clientSecret, setClientSecret] = useState("");
  const [myPackage, setMyPackage] = useState(dataPackages[0]);

  


  useEffect(() => {}, [dataLocalUser]);
  useEffect(() => {
    if (pkgSelected !== "") {
      //console.log('package selected: ', pkgSelected);
      const dataPkgSelected = dataPackages[parseInt(pkgSelected) - 1];
      createPaymentIntent(dataPkgSelected);
      setMyPackage(dataPackages[parseInt(pkgSelected) - 1]);
    }
  }, [pkgSelected]);

  // Create PaymentIntent

  const createPaymentIntent = async (dataPkgSelected: TDataPackage) => {
    if(!dataLocalUser) return;

    setLoading(true);
    const dataPaymentIntent = {
      user: dataLocalUser._id,
      pkg: dataPkgSelected,
    };
    try {
      const result = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dataPaymentIntent }),
      });
      const data = await result.json();
      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setErrorMsg("Error creating payment intent");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      setLoading(false);
    }
  };

  const appearance: Appearance = {
    theme: "stripe",
  };

  const locale = t("lang");

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    locale: locale as StripeElementsOptions["locale"],
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetPkgSelected setPkgSelected={setPkgSelected} />
      </Suspense>
      {!clientSecret&&loading && (
        <div className="flex justify-center items-center mt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {errorMsg && (
        <div className="flex justify-center items-center mt-8">
          <div className="alert alert-error">{errorMsg}</div>
        </div>
      )}
      {clientSecret && (
        <div className="flex justify-center items-center mt-8">
          <div className="card w-96 bg-gray-300 text-black shadow-xl p-6 rounded-xl">
            <div className="">
              <h2 className="text-center text-4xl my-4">{t('title')}</h2>
              <p className="text-2xl mb-2">{t('package')} {myPackage.name}</p>
              <p className="text-xl">{t('amount')} {myPackage.price}</p>
            </div>
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
