"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { IDataUser } from "../Activation/Activation";
import axios from "axios";

type TPaymentResult = {
  paymentIntent: string;
  paymentResult: string;
};

interface GetPaymentResultProps {
  setPaymentResult: (paymentResult: TPaymentResult) => void;
}

const GetPaymentResult: FC<GetPaymentResultProps> = ({ setPaymentResult }) => {
  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("redirect_status");
  const paymentIntent = searchParams.get("payment_intent");
  useEffect(() => {
    if (paymentResult && paymentIntent) {
      setPaymentResult({ paymentIntent, paymentResult });
    }
  }, [paymentResult, paymentIntent]);

  return null;
};

const Result = () => {
  const [dataPaymentResult, setDataPaymentResult] =
    useState<TPaymentResult | null>(null);
  const [dataLocalUser, setDataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  const t = useTranslations("PaymentResult");
  const router = useRouter();

  useEffect(() => {}, [dataLocalUser]);

  useEffect(() => {
    if (
      dataPaymentResult &&
      dataPaymentResult.paymentResult === "succeeded" &&
      dataLocalUser
    ) {
      handleUpdatePayment();
    }
  }, [dataPaymentResult]);

  const handleClick = () => {
    router.push("/dashboard");
  };

  const handleUpdatePayment = async () => {
    try {
      const resultUpdatePayment = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment`,
        {
          ...dataPaymentResult,
        }
      );
      console.log(resultUpdatePayment);
      //ahora se recuperan los datos del usuario de la base de datos y despues se actualizan en localstorage
      if (resultUpdatePayment.data) {
        const responseUser = await axios.get(
          `/api/user?userId=${dataLocalUser?._id}`
        );

        if (responseUser.data) {
          setDataLocalUser({
            ...responseUser.data,
            token: dataLocalUser?.token || "",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Suspense fallback="loading...">
        <GetPaymentResult setPaymentResult={setDataPaymentResult} />
      </Suspense>
      {dataPaymentResult && (
        <div className="flex items-center justify-center mt-8">
          <div className="card bg-gray-200 text-black dark:bg-primary dark:text-primary-content w-96">
            <div className="card-body">
              <h2 className="card-title">{t("title")}</h2>
              {dataPaymentResult.paymentResult === "succeeded" ? (
                <div className="alert alert-success mt-4">
                  <div className="flex-1">
                    <label>{t("success")}</label>
                  </div>
                </div>
              ) : (
                <div className="alert alert-error mt-4">
                  <div className="flex-1">
                    <label>{t("error")}</label>
                  </div>
                </div>
              )}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary dark:btn-info"
                  onClick={handleClick}
                >
                  {t("button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Result;
