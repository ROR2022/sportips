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
import { MyThemeSwitch } from "../myThemeSwitch";
import { IDataUser } from "../Activation/Activation";
//import Drawer from './Drawer';

const Navbar = () => {
  const [, startTransition] = useTransition();
  const [mainTitle, setMainTitle] = useState(MAIN_APP_NAME);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations("Navbar");
  const [dataLocalUser] = useLocalStorage<IDataUser | null>(
    "dataLocalUserInnovare",
    null
  );
  //const [showDrawer, setShowDrawer] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (dataLocalUser && isMounted) {
      setMainTitle(dataLocalUser.name);
    } 
    if(!dataLocalUser && isMounted){
      setMainTitle(MAIN_APP_NAME);
    }
  }, [dataLocalUser]);

  const navLogin = () => {
    router.push(dataLocalUser ? "/logout" : "/login");
  };

  const navHome = () => {
    router.push("/");
  };

  const navDashboard = () => {
    router.push("/dashboard");
  };

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
  };

  return (
    <div className="drawer " suppressHydrationWarning>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
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
            onClick={navHome}
          >
            {mainTitle}
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              {dataLocalUser && isMounted && (
                <li>
                  <button className="btn btn-square btn-ghost w-auto me-2" onClick={navDashboard}>
                    {t('dashboard')}
                  </button>
                </li>
              )}
              <li>
                <button className="btn btn-square btn-ghost w-auto" onClick={navLogin}>
                  {dataLocalUser&&isMounted ? t("logout") : t("login")}
                </button>
              </li>
              <li>
                <button className="btn btn-square btn-ghost">
                  <HiLanguage onClick={handleLanguage} className="text-xl" />
                </button>
              </li>
              <li>
                <button className="btn btn-square btn-ghost">
                  <MyThemeSwitch />
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {dataLocalUser&&isMounted && (
            <li>
              <button
                className="btn btn-square btn-ghost w-full flex justify-start ps-4"
                onClick={navDashboard}
              >
                {t("dashboard")}
              </button>
            </li>
          )}
          <li>
            <button
              className="btn btn-square btn-ghost w-full flex justify-start ps-4"
              onClick={navLogin}
            >
              {dataLocalUser&&isMounted ? t("logout") : t("login")}
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4">
              <HiLanguage onClick={handleLanguage} className="text-xl" />
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4">
              <MyThemeSwitch />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
