"use client";
import React, { useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { HiLanguage } from "react-icons/hi2";
import { useLocalStorage } from "usehooks-ts";
import { useTranslations } from "next-intl";
//import Cookies from 'js-cookie';
import { setUserLocale, getUserLocale } from "@/services/locale";
import { MAIN_APP_NAME } from "@/dataEnv/dataEnv";
//import { ThemeSwitch } from '../theme-switch';
//import { MyThemeSwitch } from "../myThemeSwitch";
import { IDataUser } from "../Activation/Activation";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { generateUniqueId } from "@/services/libAux";
import { useTheme } from "next-themes";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

//import Drawer from './Drawer';


const navigationPages = [
  "dashboard",
  "profile",
  "pricing",
];


const Navbar = () => {
  const [, startTransition] = useTransition();
  const [mainTitle, setMainTitle] = useState(MAIN_APP_NAME);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Navbar");
  const [dataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  const [imageUser, setImageUser] = useState<string>(
    dataLocalUser?.imageUrl || ""
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (dataLocalUser && isMounted) {
      const fisrtWord = dataLocalUser.name.split(" ")[0];
      setMainTitle(fisrtWord);
      if (dataLocalUser.imageUrl && dataLocalUser.imageUrl !== imageUser) {
        setImageUser(dataLocalUser.imageUrl);
      }
    }
    if (!dataLocalUser && isMounted) {
      setMainTitle(MAIN_APP_NAME);
      setImageUser("");
    }
  }, [dataLocalUser]);

  
  const navToPage = (page: string) => {
    setShowDrawer(false);
    router.push(page);
  }

  const handleLanguage = async () => {
    //console.log('Change Language')
    const lang = await getUserLocale();

    startTransition(() => {
      if (lang === "en") {
        setUserLocale("es");
      } else {
        setUserLocale("en");
      }
    });

    setShowDrawer(false);
  };

  const handleShowDrawer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDrawer(e.target.checked);
    //console.log('toggle drawer: ',e.target.checked);
  };

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    if(showDrawer) setShowDrawer(false);
  };

  if(!isMounted) return null;

  return (
    <div className="drawer " suppressHydrationWarning>
      <input id="my-drawer-3" checked={showDrawer} type="checkbox" className="drawer-toggle" onChange={handleShowDrawer} />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar w-full bg-white dark:bg-black text-black dark:text-white">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div
            className="mx-2 flex-1 px-2 text-2xl font-bold"
            style={{ cursor: "pointer" }}
            onClick={()=>navToPage('/')}
          >
            <span className="flex gap-1 items-center">
            {isMounted && imageUser && (
              <Image
                  alt="user image"
                  className="rounded-full"
                  height={50}
                  src={imageUser}
                  width={50}
                />
            )}
                
              
            {mainTitle}
            </span>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              {dataLocalUser && isMounted && (
                <>
                {navigationPages.map((page) => (
                  <li key={generateUniqueId()}>
                    <button
                      className="btn btn-square btn-ghost w-auto me-2"
                      onClick={()=>navToPage(`/${page}`)}
                    >
                      {t(page)}
                    </button>
                  </li>
                ))}
                </>
              )}
              <li>
                <button
                  className="btn btn-square btn-ghost w-auto me-2"
                  onClick={()=>dataLocalUser ? navToPage('/logout') : navToPage('/login')}
                >
                  {dataLocalUser && isMounted ? t("logout") : t("login")}
                </button>
              </li>
              <li>
                <button className="btn btn-square btn-ghost me-2" onClick={handleLanguage}>
                  <span><HiLanguage  className="text-xl" /></span>
                  <span>{t("lang")=== "en" ? "Español" : "English"}</span>
                </button>
              </li>
              <li>
                <button className="btn btn-square btn-ghost" onClick={handleToggleTheme}>
                {theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
                {theme === "light" ? "Dark" : "Light"}
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
      </div>
      <div className="drawer-side" style={{ zIndex: 1000 }}>
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          
        
          {/* Sidebar content here */}
          {dataLocalUser && isMounted && (
            <>
            {navigationPages.map((page) => 
              <li key={generateUniqueId()}>
                <button
                  className="btn btn-square btn-ghost w-full flex justify-start ps-4"
                  onClick={()=>navToPage(`/${page}`)}
                >
                  {t(page)}
                </button>
              </li>
            )}
            </>
          )}
          <li>
            <button
              className="btn btn-square btn-ghost w-full flex justify-start ps-4"
              onClick={()=> dataLocalUser? navToPage('/logout') : navToPage('/login')}
            >
              {dataLocalUser && isMounted ? t("logout") : t("login")}
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4" onClick={handleLanguage}>
              <HiLanguage className="text-xl" />
              {t("lang")=== "en" ? "Español" : "English"}
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4" onClick={handleToggleTheme}>
              {theme === "light" ? <MoonFilledIcon /> : <SunFilledIcon />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </li>
          <li>
            <button
              className="btn btn-square btn-ghost w-full flex justify-start ps-4"
              onClick={()=>setShowDrawer(false)}
            >
              <IoMdClose  className="text-right" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
