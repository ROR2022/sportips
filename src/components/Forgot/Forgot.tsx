"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { forgotPassword } from "@/hooks/useUserApi";

const Forgot = () => {
  const router = useRouter();
  const t = useTranslations("Forgot");
  const [emailUser, setEmailUser] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleClick = async () => {
    if (!validateEmail(emailUser)) {
      console.log("Invalid email address");
      return;
    }
    setLoading(true);
    try {
      const result = await forgotPassword(emailUser);
      console.log("result forgotPassword:..", result);
      const { error } = result;
      if (error) {
        console.log("error forgotPassword:..", error);
        setErrorMsg(error);
      } else {
        console.log("Email sent successfully");
        router.push("/recovery?email=" + emailUser);
      }
      setLoading(false);
    } catch (error) {
      console.log("error forgotPassword:..", error);
      setErrorMsg(String(error));
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center mt-8">
      <div className="card bg-gray-200 dark:bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{t("title")}</h2>
          <p>{t("description")}</p>
          <input
            type="email"
            placeholder={t("placeholder")}
            className="input input-bordered w-full max-w-xs bg-white dark:bg-black"
            value={emailUser}
            onChange={(e) => setEmailUser(e.target.value)}
          />
          {errorMsg && (
            <div className="alert alert-error mt-4">
              <div className="flex-1">
                <label>{errorMsg}</label>
              </div>
            </div>
          )}
          <div className="card-actions justify-end">
            <button className="btn btn-primary" disabled={loading} onClick={handleClick}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : t("button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
