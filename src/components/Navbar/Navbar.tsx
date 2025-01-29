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
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

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

  const navLogin = () => {
    setShowDrawer(false);
    router.push(dataLocalUser ? "/logout" : "/login");
  };

  const navHome = () => {
    setShowDrawer(false);
    router.push("/");
  };

  const navDashboard = () => {
    setShowDrawer(false);
    router.push("/dashboard");
  };

  const navProfile = () => {
    setShowDrawer(false);
    router.push("/profile");
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

    setShowDrawer(false);
  };

  const handleShowDrawer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDrawer(e.target.checked);
    //console.log('toggle drawer: ',e.target.checked);
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
            onClick={navHome}
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
                  <li>
                    <button
                      className="btn btn-square btn-ghost w-auto me-2"
                      onClick={navDashboard}
                    >
                      {t("dashboard")}
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-square btn-ghost w-auto me-2"
                      onClick={navProfile}
                    >
                      {t("profile")}
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  className="btn btn-square btn-ghost w-auto"
                  onClick={navLogin}
                >
                  {dataLocalUser && isMounted ? t("logout") : t("login")}
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
      <div className="drawer-side" style={{ zIndex: 1000 }}>
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <li>
            <button
              className="btn btn-square btn-ghost w-full flex justify-start ps-4"
              onClick={()=>setShowDrawer(false)}
            >
              <IoMdClose  className="text-right" />
            </button>
          </li>
        
          {/* Sidebar content here */}
          {dataLocalUser && isMounted && (
            <>
            <li>
              <button
                className="btn btn-square btn-ghost w-full flex justify-start ps-4"
                onClick={navDashboard}
              >
                {t("dashboard")}
              </button>
            </li>
            <li>
              <button
                className="btn btn-square btn-ghost w-full flex justify-start ps-4"
                onClick={navProfile}
              >
                {t("profile")}
              </button>
            </li>
            </>
          )}
          <li>
            <button
              className="btn btn-square btn-ghost w-full flex justify-start ps-4"
              onClick={navLogin}
            >
              {dataLocalUser && isMounted ? t("logout") : t("login")}
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4" onClick={handleLanguage}>
              <HiLanguage className="text-xl" />
            </button>
          </li>
          <li>
            <button className="btn btn-square btn-ghost w-full flex justify-start ps-4" onClick={()=>setShowDrawer(false)}>
              <MyThemeSwitch />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
