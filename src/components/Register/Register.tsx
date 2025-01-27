"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { createUser } from "@/hooks/useUserApi";


type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  activationCode: number;
};

const initFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  activationCode: 0,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
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
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const Register = () => {
  const router = useRouter();
  const t = useTranslations("Register");
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: initFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //eslint-disable-next-line
      //console.log("Form values:..", values);
      handleRegisterUser(values);
    },
  });
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
  } = formik;

  const handleRegisterUser = async (values: RegisterValues) => {
    //console.log("Register values:..", values);
    try {
      setLoading(true);
      const response = await createUser(values);
      //console.log("User created:..", response);
      const { _id }=response;
      if(_id){
        //alert('User created successfully');
        router.push("/activation?email="+values.email);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  };

  return (
    <div className="flex justify-center mt-8">
      <div className="card bg-gray-200 dark:bg-base-100 w-96 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title text-3xl">{t("title")}</h2>
            <Link className="text-sm underline text-cyan-500" href="/login">
              {t("alreadyRegistered")}
            </Link>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("name")}</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="input input-bordered bg-white dark:bg-black"
                placeholder={t("name")}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && touched.name && (
                <div className="text-red-500">{errors.name}</div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("email")}</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="input input-bordered bg-white dark:bg-black"
                placeholder={t("email")}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("password")}</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="input input-bordered bg-white dark:bg-black"
                placeholder={t("password")}
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
                id="confirmPassword"
                className="input input-bordered bg-white dark:bg-black"
                placeholder={t("confirmPassword")}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-red-500">{errors.confirmPassword}</div>
              )}
            </div>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary bg-cyan-100 dark:bg-cyan-900"
              >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : t("title")}
                
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;