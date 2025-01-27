"use client";
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { useLocalStorage } from 'usehooks-ts';
import { IDataUser } from '../Activation/Activation';

const listBenefitsES = [
    "Consejos personalizados",
    "Disponibilidad 24/7",
    "Basado en principios prácticos",
    "Confidencialidad absoluta",
];

const listBenefitsEN = [
    "Personalized advice",
    "24/7 availability",
    "Based on practical principles",
    "Absolute confidentiality",
];

const Landing = () => {
    const t = useTranslations('HomePage');
    const router = useRouter();
    const [langSelected, setLangSelected] = useState<string>(t('lang'));
    const [listBenefits, setListBenefits] = useState(listBenefitsES);
    const [dataLocalUser] = useLocalStorage<IDataUser | null>(
        "dataLocalUserInnovare",
        null
      );

    useEffect(() => {
        if(langSelected === 'es') {
            setListBenefits(listBenefitsES);
        } else {
            setListBenefits(listBenefitsEN);
        }
    }, [langSelected]);

    useEffect(()=>{
      if(t('lang') !== langSelected){
        setLangSelected(t('lang'))
      }
    },[t('lang')])

    const handleClick = () => {
        //console.log('Button clicked');
        if(dataLocalUser){
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }

  return (
    <div>
    
    <div className="bg-gradient-to-b from-blue-900 to-purple-800 text-white min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-gray-200">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t('title')}
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          {t('subTitle')}
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700" onClick={handleClick}>
            {t('button1')}
          </button>
        </div>
      </section>

      {/* Problema y Solución */}
      <section className="bg-white text-blue-900 py-16 px-8 dark:bg-gray-800 dark:text-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6">
          {t('section1')}
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-center">
          {t('description1')}
        </p>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('section2')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {listBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white text-blue-900 p-6 rounded-xl shadow-lg text-center dark:bg-gray-800 dark:text-gray-200"
            >
              <p className="font-bold">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Llamado a la acción */}
      <section className="bg-purple-500 py-20 px-8 text-center dark:bg-purple-900">
        <h2 className="text-3xl font-bold mb-6">
          {t('section3')}
        </h2>
        <button className="px-6 py-3 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700" onClick={handleClick}>
          {t('button1')}
        </button>
      </section>
    </div>
    </div>
  )
}

export default Landing

/*
    
  


*/