"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "usehooks-ts";

const Logout = () => {
    const t = useTranslations('Logout');
    const router = useRouter();
    const [, setDataLocalUser] = useLocalStorage("dataLocalUserInnovare", null);

    const handleCancel = () => {
        router.push('/dashboard');
    };

    const handleLogout = () => {
        setDataLocalUser(null);
        router.push('/');
    };


  return (
    <div className="flex items-center justify-center mt-8">
      <div className="card bg-gray-100 text-black dark:bg-gray-900 dark:text-white w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{t('title')}</h2>
          <p>{t('description')}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary" onClick={handleCancel}>{t('cancel')}</button>
            <button className="btn btn-primary" onClick={handleLogout}>{t('accept')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
