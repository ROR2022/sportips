"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "@/hooks/useUserApi";
import { GetParams } from "../Activation/Activation";

type RecoveryValues = {
  email: string;
  code: number;
  password: string;
  confirmPassword: string;
};

const initFormValues = {
  email: "",
  code: 0,
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Invalid email address"
    ),
  code: Yup.number().required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(20, "Password is too long - should be 20 chars maximum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter.")
    .matches(/(?=.*[a-z])/, "Password must contain a lowercase letter.")
    .matches(/(?=.*[!@#$%^&*])/, "Password must contain a special character."),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const Recovery = () => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("Recovery");

  const formik = useFormik({
    initialValues: initFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //eslint-disable-next-line
      console.log("Form values:..", values);
      handleRecoveryUser(values);
    },
  });
  useEffect(() => {
    if (emailUser !== "") {
      //console.log("emailUser:..", emailUser);
      formik.setFieldValue("email", emailUser);
    }
  }, [emailUser]);

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  const handleRecoveryUser = async (values: RecoveryValues) => {
    console.log("Recovery values:..", values);
    try {
        setLoading(true);
      const dataRecovey = {
        email: values.email || emailUser,
        code: values.code,
        password: values.password,
      };
      const resultRecovery = await resetPassword(dataRecovey);
      console.log("result recoveryUser:..", resultRecovery);
      const { error } = resultRecovery;
      if (error) {
        console.log("error recoveryUser:..", error);
        setErrorMsg(error);
      } else {
        console.log("Password recovery successfully");
        router.push("/login");
      }
        setLoading(false);
    } catch (error) {
      console.log("error recoveryUser:..", error);
      setErrorMsg(String(error));
        setLoading(false);
    }
  };
  return (
    <div className="flex justify-center mt-8">
      <Suspense fallback={<div>Loading...</div>}>
        <GetParams setEmailUser={setEmailUser} />
      </Suspense>
      <div className="card bg-gray-200 dark:bg-base-100 w-96 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title text-3xl">{t("title")}</h2>
            <p className="text-xs">{t('description')}</p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("email")}</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                className="input input-bordered"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={emailUser !== ""}
              />
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("code")}</span>
              </label>
              <input
                type="number"
                name="code"
                placeholder={t("code")}
                className="input input-bordered"
                value={String(values.code)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.code && touched.code && (
                <div className="text-red-500">{errors.code}</div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("password")}</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder={t("password")}
                className="input input-bordered"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("confirmPassword")}</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("confirmPassword")}
                className="input input-bordered"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-red-500">{errors.confirmPassword}</div>
              )}
            </div>
            {errorMsg && (
              <div className="alert alert-error mt-4">
                <div className="flex-1">
                  <label>{errorMsg}</label>
                </div>
              </div>
            )}
            <div className="card-actions justify-end">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading && <span className="loading loading-spinner loading-sm"></span>}
                {!loading && t("button")}
                
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Recovery;
