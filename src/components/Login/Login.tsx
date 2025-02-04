"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { loginUser } from "@/hooks/useUserApi";
import { useLocalStorage } from "usehooks-ts";
import { IDataUser } from "../Activation/Activation";

type LoginValues = {
  email: string;
  password: string;
};

const initFormValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Invalid email address"
    ),
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(20, "Password is too long - should be 20 chars maximum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter.")
    .matches(/(?=.*[a-z])/, "Password must contain a lowercase letter.")
    .matches(/(?=.*[!@#$%^&*])/, "Password must contain a special character."),
});

const Login = () => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [, setDataLocalUser] = useLocalStorage<IDataUser|null>("dataLocalUserInnovare", null);
  const t = useTranslations("Login");
  const router = useRouter();
  const formik = useFormik({
    initialValues: initFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //eslint-disable-next-line
      //console.log("Form values:..", values);
      handleLoginUser(values);
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  const handleLoginUser = async (values: LoginValues) => {
    //console.log("Login values:..", values);
    try {
      setLoading(true);
      const resultLogin = await loginUser(values.email, values.password);
      //console.log("Result login:..", resultLogin);
      const { error } = resultLogin;
      if (error) {
        setErrorMsg(error);
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      } else {
        setErrorMsg("");
        setDataLocalUser(resultLogin);
        router.push("/profile");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:..", error);
      setErrorMsg("Error: " + String(error));
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="card bg-gray-200 dark:bg-base-100 w-96 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title text-3xl">{t("title")}</h2>
            <Link className="text-sm underline text-cyan-500" href="/register">
              {t("notRegistered")}
            </Link>
            <label className="input input-bordered flex items-center gap-2 bg-white text-black dark:bg-black dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                name="email"
                value={values.email}
                type="email"
                className="grow"
                placeholder={t("email")}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </label>
            {errors.email && touched.email && (
              <div className="text-purple-600 text-sm opacity">
                {errors.email}
              </div>
            )}
            <label className="input input-bordered flex items-center gap-2 bg-white text-black dark:bg-black dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                name="password"
                value={values.password}
                placeholder={t("password")}
                type="password"
                className="grow"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </label>
            {errors.password && touched.password && (
              <div className="text-purple-600 text-sm opacity">
                {errors.password}
              </div>
            )}
            <Link className="text-sm underline text-cyan-500" href="/forgot">
              {t("forgotPassword")}
            </Link>
            {errorMsg && (
              <div className="alert alert-error mt-4">
                <div className="flex-1">
                  <label>{errorMsg}</label>
                </div>
              </div>
            )}
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary bg-cyan-100 text-black dark:bg-cyan-900 dark:text-white"
                type="submit"
              >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : t("title")}
                
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
