"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Pricing = () => {
  const t = useTranslations("Pricing");
  const router = useRouter();

  const packages = [
    {
      id: t('basic'),
      name: t("basic"),
      price: t('costBasic'),
      benefits: [
        t("descBasic"),
      ],
    },
    {
      id: t('premium'),
      name: t("premium"),
      price: t('costPremium'),
      benefits: [
        t("descPremium"),
      ],
    },
  ];

  
  const handleSelectPackage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pkgSelected= e.currentTarget.id;
    const numPkg= pkgSelected === t('basic') ? 1 : 2;
    console.log('package selected: ', pkgSelected);
    router.push(`/payment?pkg=${numPkg}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-base-200 dark:text-inherit flex flex-col items-center py-12">
      <h2 className="text-4xl font-bold mb-3">{t("title")}</h2>
      <p className="text-xl mb-6 text-center">{t('subDescription')}</p>
      <div className="flex flex-wrap justify-center gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="card w-80 bg-gray-300 text-black dark:bg-gray-900 dark:text-white shadow-xl p-6 rounded-xl">
            <h3 className="text-2xl font-semibold text-center">{pkg.name}</h3>
            <p className="text-center text-xl font-bold text-blue-600 mt-2">{pkg.price}</p>
            <ul className="mt-4 space-y-2 text-black dark:text-white">
              {pkg.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  ✅ {benefit}
                </li>
              ))}
            </ul>
            <button id={pkg.id} className="mt-6 btn btn-primary w-full" onClick={handleSelectPackage}>{t("button")}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
