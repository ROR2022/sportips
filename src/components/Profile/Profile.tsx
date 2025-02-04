"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { IDataUser } from "../Activation/Activation";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { updateUser, updateUserFormData } from "@/hooks/useUserApi";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { enUS } from "date-fns/locale/en-US";

registerLocale("es", es);
registerLocale("en", enUS);

interface IFormValues {
  name: string;
  email: string;
  birthDate?: Date | null;
}

//imageUrl: '/images/default-profile.png'
//el schema permita que el campo birthDate sea date or null
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  birthDate: Yup.date().nullable(),
});

const Profile = () => {
  const router = useRouter();
  const t = useTranslations("Profile");
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(t("lang"));
  const [dataLocalUser, setDataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  const [imageUser, setImageUser] = useState<string>(
    dataLocalUser?.imageUrl || "/images/default-profile.png"
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (t("lang") !== selectedLanguage) {
      setSelectedLanguage(t("lang"));
    }
  }, [t("lang")]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (dataLocalUser?.imageUrl) {
      setImageUser(dataLocalUser.imageUrl);
    }
    if (dataLocalUser) {
      const qBuyed = dataLocalUser.questionsBuyed || 0;
      const qFree = dataLocalUser.questionsFree || 0;
      setTotalQuestions(qBuyed + qFree);
    }
  }, [dataLocalUser]);

  const formik = useFormik({
    initialValues: {
      name: dataLocalUser?.name || "",
      email: dataLocalUser?.email || "",
      birthDate: dataLocalUser?.birthDate || null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //console.log('Form values:..', values)
      handleUpdateUser(values);
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = formik;

  const handleUpdateUser = async (values: IFormValues) => {
    setLoading(true);
    try {
      let newDataUser = null;
      let result = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("birthDate", values.birthDate?.toISOString() || "");
        formData.append("_id", dataLocalUser?._id || "");
        result = await updateUserFormData(formData);
      } else {
        newDataUser = {
          _id: dataLocalUser?._id || "",
          name: values.name,
          email: values.email,
          birthDate: values.birthDate?.toISOString() || "",
          imageUrl: dataLocalUser?.imageUrl || "",
        };
        result = await updateUser(newDataUser);
      }
      console.log("result handleUpdateUser:..", result);
      if (result) {
        setDataLocalUser(result);
        setSuccessMessage(t("successMsg"));
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(t("errorMsg"));
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }

      //router.push('/dashboard');
      setLoading(false);
    } catch (error) {
      console.log("error handleUpdateUser:..", error);
      setLoading(false);
      setErrorMessage(t("errorMsg"));
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleChangeImageUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //setImageUser(file);
      setSelectedImage(file);
    }
  };

  const handleClearImageUser = () => {
    setImageUser("/images/default-profile.png");
    setSelectedImage(null);
  };

  const handleChangeBirthDate = (date: Date | null) => {
    console.log("birthDate:..", date);
    setFieldValue("birthDate", date);
  };

  const handleBuyQuestions = () => {
    router.push("/pricing");
  }

  if (!isMounted) return null;

  return (
    <div className="flex justify-center mt-8">
      <div className="card bg-gray-200 text-black dark:bg-base-100 dark:text-white w-96 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title text-3xl">{t("title")}</h2>
            {!dataLocalUser?.birthDate && (
              <p className="text-xs text-error">{t("description")}</p>
            )}
            
            {imageUser && (
              <div className="flex items-center justify-center my-2">
                <p>{t("currentImage")}</p>
                <Image
                  alt="user image"
                  className="rounded-full"
                  height={100}
                  src={imageUser}
                  width={100}
                />
              </div>
            )}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("name")}</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input input-bordered text-white bg-gray-900"
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
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input input-bordered text-white bg-gray-900"
                disabled
              />
              {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("questions")}</span>
              </label>
              <div className="flex gap-2">
              <input
                type="text"
                value={totalQuestions}
                className="input input-bordered text-white bg-gray-900"
                disabled
              />
              <button
                className="btn btn-accent dark:btn-secondary"
                onClick={handleBuyQuestions}
              >
                {t("lang") === "es" ? "Comprar" : "Buy"}
              </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("birthDate")}</span>
              </label>
              <DatePicker
                selected={values.birthDate ? new Date(values.birthDate) : null}
                onChange={handleChangeBirthDate}
                dateFormat="yyyy-MM-dd"
                className="input input-bordered w-full text-white bg-gray-900"
                locale={selectedLanguage}
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText={t("selectBirthDate")}
              />
              {errors.birthDate && touched.birthDate && (
                <div className="text-red-500">{String(errors.birthDate)}</div>
              )}
            </div>

            <div className="form-control my-2">
              <label
                className="py-2 relative cursor-pointer rounded-md bg-slate-300 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-white hover:bg-slate-400"
                htmlFor="file-upload"
              >
                <div className="ps-3">{t("selectImage")}</div>
                <input
                  className="sr-only"
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  value={""}
                  onChange={handleChangeImageUser}
                />
              </label>
              <div className="text-sm text-gray-500">
                {selectedImage ? (
                  <div className="flex items-center justify-center my-2 gap-2">
                    <Image
                      alt="user image"
                      className="rounded-full"
                      height={100}
                      src={URL.createObjectURL(selectedImage)}
                      width={100}
                    />
                    <FaRegTrashAlt
                      className="text-danger cursor-pointer"
                      onClick={handleClearImageUser}
                    />
                  </div>
                ) : (
                  <span className="text-xs ps-2">{t("noImage")}</span>
                )}
              </div>
            </div>
            <div className="form-control">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  t("button")
                )}
              </button>
            </div>
            {successMessage && (
              <div className="alert alert-success mt-4">
                <div className="flex-1">
                  <label>{successMessage}</label>
                </div>
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-error mt-4">
                <div className="flex-1">
                  <label>{errorMessage}</label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
