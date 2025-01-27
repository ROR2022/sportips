"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { generateUniqueId } from "@/services/libAux";
import FunnyImages from "./FunnyImages";

const listQuestionsES = [
  { id: "q01", question: "Dame 5 consejos para mejorar mi salud mental?" },
  { id: "q02", question: "Dime que puedo hacer para mejorar mi productividad en el trabajo?" },
  { id: "q03", question: "Como puedo mejorar mi relación con mi pareja?" },
];

const listQuestionsEN = [
  { id: "q01", question: "Give me 5 tips to improve my mental health?" },
  { id: "q02", question: "Tell me what I can do to improve my productivity at work?" },
  { id: "q03", question: "How can I improve my relationship with my partner?" },
];

const Dashboard = () => {
  const t = useTranslations("Dashboard");
  const [message, setMessage] = useState<string>("");
  const [responseChat, setResponseChat] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [langSelected, setLangSelected] = useState<string>(t("myLang"));
  const [listQuestions, setListQuestions] = useState(listQuestionsES);
  const [listMsgs, setListMsgs] = useState<string[]>([]);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (langSelected === "es") {
      setListQuestions(listQuestionsES);
    } else {
      setListQuestions(listQuestionsEN);
    }
  }, [langSelected]);

  useEffect(() => {
    if (t("myLang") !== langSelected) {
      setLangSelected(t("myLang"));
      handleClear();
    }
  }, [t("myLang")]);

  const handleSearch = async (tempMsg: string) => {
    if (message === "" && !tempMsg) return;
    setLoading(true);
    try {
      const query = tempMsg || message || "Que consejos me puedes dar?";
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        body: JSON.stringify({ message: query, lang: langSelected }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data?.message) {
        const stringMsg = data?.message;
        const listMsgsTemp = stringMsg.split("\n");
        setListMsgs(listMsgsTemp);
        setResponseChat(data?.message);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleClear = () => {
    setMessage("");
    setResponseChat("");
    setListMsgs([]);
  };

  const handleSelectQuestion = (question: string) => {
    handleClear();
    handleSearch(question);
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-purple-800 text-white min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-gray-200 pt-8 flex flex-col items-center">
      <h1 className="text-center my-8 text-4xl font-bold text-white">{t("title")}</h1>
      
      
      <div className="flex justify-center my-4 w-full">
        <div className={`flex gap-2 w-full max-w-lg ${isMobile ? "flex-col" : "flex-row"}`}>
          <input
            type="text"
            className="w-full py-3 px-6 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 text-black dark:text-white"
            value={message}
            placeholder={t("free")}
            onChange={changeSearch}
            style={{ width: isMobile ? "100%" : "400px" }}
          />
          <div className="flex justify-center gap-2">
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:bg-blue-700"
            disabled={loading}
            onClick={() => handleSearch(message)}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <IoMdSearch />
            )}
          </button>
          <button
            className="bg-red-600 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:bg-red-700"
            onClick={handleClear}
          >
            <IoMdClose />
          </button>
          </div>
        </div>
      </div>

      <h2 className="text-center my-8 text-2xl font-bold text-white">{t("sugested")}</h2>

      <div className="space-y-4">
        {listQuestions.map((item) => (
          <div key={item.id} className="w-full">
            <div className="collapse collapse-arrow bg-base-200 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-medium text-white">{item.question}</div>
              <div className="collapse-content">
                <button
                  className="btn btn-primary bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                  disabled={loading}
                  onClick={() => handleSelectQuestion(item.question)}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    t("search")
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
          <div className="flex justify-center my-4 gap-4">
            <span className="loading loading-bars loading-lg"></span>
            <FunnyImages />
          </div>
        )}
      
        

        {listMsgs.length > 0 && (
          <div className="my-8 w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg bg-base-100">
          <div className="card bg-base-100 w-full shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl font-bold">{t("response")}:</h2>
              {listMsgs.map((msg) => (
                <p key={generateUniqueId()} className="text-lg">{msg}</p>
              ))}
            </div>
          </div>
          </div>
        )}
      
    </div>
  );
};

export default Dashboard;
