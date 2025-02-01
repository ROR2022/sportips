"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useMediaQuery } from "usehooks-ts";
import { IoMdClose, IoMdSearch, IoMdMic, IoMdMicOff, IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { generateUniqueId } from "@/services/libAux";
import FunnyImages from "./FunnyImages";
import { IDataUser } from "../Activation/Activation";
import axios from "axios";

const listQuestionsES = [
  { id: "q01", question: "¿Dame 5 consejos para mejorar mi salud mental?" },
  {
    id: "q02",
    question:
      "¿Dime que puedo hacer para mejorar mi productividad en el trabajo?",
  },
  { id: "q03", question: "¿Como puedo mejorar mi relación con mi pareja?" },
  { id: "q04", question: "¿Que dice mi carta astral?" },
];

const listQuestionsEN = [
  { id: "q01", question: "Give me 5 tips to improve my mental health?" },
  {
    id: "q02",
    question: "Tell me what I can do to improve my productivity at work?",
  },
  { id: "q03", question: "How can I improve my relationship with my partner?" },
  { id: "q04", question: "What does my astral chart say?" },
];

const Dashboard = () => {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [showBuyQuestions, setShowBuyQuestions] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [dataLocalUser, setDataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [langSelected, setLangSelected] = useState<string>(t("myLang"));
  const [listQuestions, setListQuestions] = useState(listQuestionsES);
  const [listMsgs, setListMsgs] = useState<string[]>([]);

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
    }
    if(typeof window !== "undefined"){
      setIsMounted(true);
    }
    
    return () => {
      setIsMounted(false);
    };
  }, []);

  

  useEffect(() => {
    if (dataLocalUser) {
      const qBuyed = dataLocalUser.questionsBuyed || 0;
      const qFree = dataLocalUser.questionsFree || 0;
      setTotalQuestions(qBuyed + qFree);
    }
  }, [dataLocalUser]);

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
    if(!dataLocalUser){
      //alert("No se ha encontrado información del usuario.");
      console.error("No se ha encontrado información del usuario.");
      return;
    }
    if (message === "" && !tempMsg) return;
    setLoading(true);
    try {
      const query = tempMsg || message || "Que consejos me puedes dar?";

      const findAstral = query.toLowerCase().indexOf("astral");
      const myBirthdate = dataLocalUser?.birthDate || "";
      let finalQuery = query;

      if (findAstral > -1) {
        finalQuery =
          langSelected === "es"
            ? `${query} mi fecha de nacimiento es: ${myBirthdate}`
            : `${query} my birthdate is: ${myBirthdate}`;
      }

      //necesito calcular el tiempo de respuesta

      console.time("fetch chatbot: ");

      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        body: JSON.stringify({ message: finalQuery, lang: langSelected, userId: dataLocalUser?._id }),
        headers: { "Content-Type": "application/json" },
      });

      console.timeEnd("fetch chatbot: ");
      
      
      const data = await response.json();
      //console.log("data search: ", data);

      if (data?.message) {
        const stringMsg = data?.message;
        const listMsgsTemp = stringMsg.split("\n");
        setListMsgs(listMsgsTemp);
      }

      if(data?.error){
        setErrorMsg(data.error);
        setShowBuyQuestions(true);
        console.log('error search: ', data.error);
        setTimeout(() => {
          setErrorMsg("");
        }, 5000);
      }


      //ahora se recuperan los datos del usuario de la base de datos y despues se actualizan en localstorage
      const responseUser = await axios.get(`/api/user?userId=${dataLocalUser._id}`);

      if(responseUser.data){
        setDataLocalUser({
          ...responseUser.data,
          token: dataLocalUser?.token || "",
        });
      }
        
      setLoading(false);
    } catch (error) {
      console.error('error search: ', error);
      setLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Tu navegador no soporta la búsqueda por voz.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const myWindow: any = window;

    const SpeechRecognition =
      myWindow.SpeechRecognition || myWindow.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event:any) => console.log("Error en reconocimiento:", event);
    
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event:any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      handleSearch(transcript);
    };

    recognition.start();
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = listMsgs.join(". ");
    if (!textToRead) return;

    console.log("textToRead: ", textToRead);
    // Dividir el texto en fragmentos de hasta 200 caracteres (evita cortes en palabras)
  const chunks = textToRead.match(/.{1,200}(\s|$)/g) || [];

  let index = 0;
  const speakChunk = () => {
    if (index >= chunks.length) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = langSelected === "es" ? "es-ES" : "en-US";
    utterance.rate = 1;
    utterance.onend = () => {
      index++;
      speakChunk(); // Llama al siguiente fragmento cuando termine de leer
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  speakChunk(); // Iniciar lectura en partes
  };


  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleClear = () => {
    setMessage("");
    setErrorMsg("");
    setListMsgs([]);
  };

  const handleSelectQuestion = (question: string) => {
    handleClear();
    handleSearch(question);
  };

  const handleBuyQuestions = () => {
    router.push("/pricing");
  }

  if (!isMounted) return null;

  return (
    <div className="bg-gradient-to-b from-blue-900 to-purple-800 text-white min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-gray-200 pt-8 flex flex-col items-center">
      <h1 className="text-center my-8 text-4xl font-bold text-white">
        {t("title")}
      </h1>

      <div className="flex justify-center my-4 w-full">
        <div
          className={`flex gap-2 w-full max-w-lg ${
            isMobile ? "flex-col" : "flex-row"
          }`}
        >
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
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
              onClick={handleVoiceSearch}
            >
              {isListening ? <IoMdMicOff /> : <IoMdMic />}
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

      <div className="flex justify-center my-2">
        <p className="text-xs">{t('questions')} {totalQuestions}</p>
      </div>

      {errorMsg && (
        <div className="flex justify-center my-4">
        <div className="alert alert-error mt-4">
        <div className="flex-1">
          <label>{errorMsg}</label>
        </div>
      </div>
      </div>
      )}

      {showBuyQuestions && (
        <div className="flex justify-center my-4">
          <button
            className="btn btn-secondary dark:btn-primary text-xl"
            onClick={handleBuyQuestions}
          >
            {t("myLang")=== "es" ? "Comprar preguntas !!!" : "Buy questions !!!"}
          </button>
        </div>
      )}

      <h2 className="text-center my-8 text-2xl font-bold text-white">
        {t("sugested")}
      </h2>

      <div className="space-y-4">
        {listQuestions.map((item) => (
          <div key={item.id} className="w-full">
            <div className="collapse collapse-arrow bg-base-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
              <input type="radio" name="my-accordion-2" />
              <div className="collapse-title text-xl font-medium text-white">
                {item.question}
              </div>
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
        <div className="my-8 w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg text-black bg-gray-100 dark:text-white dark:bg-gray-800">
          <div className="card text-black bg-gray-100 dark:text-white dark:bg-gray-800 w-full shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
              <h2 className="card-title text-2xl font-bold">
                {t("response")}:
              </h2>
              <button className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700" onClick={handleReadAloud}>
                {isSpeaking ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
              </button>
              </div>
              {listMsgs.map((msg) => (
                <p key={generateUniqueId()} className="text-lg text-black bg-gray-100 dark:text-white dark:bg-gray-800">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
