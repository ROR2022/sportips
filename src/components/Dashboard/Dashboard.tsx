"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

const Dashboard = () => {
  const t = useTranslations("Dashboard");
  const [message, setMessage] = useState<string>("");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSearch = async () => {
    if (message === "") return;
    try {
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log('dataResponse chatbot:',data);
    } catch (error) {
      console.error(error);
    }
  };

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <h1 className="text-center my-8 text-3xl">{t("title")}</h1>
      <p className="text-center">{t("description")}</p>
      <div className="flex justify-center my-4">
        <label
          className="input input-bordered flex items-center gap-2"
          style={{ width: isMobile ? "90%" : "50%" }}
        >
          <input
            type="text"
            className="grow"
            value={message}
            placeholder={t("search")}
            onChange={changeSearch}
          />
          <button className="btn btn-active btn-ghost" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </label>
      </div>
    </div>
  );
};

export default Dashboard;
