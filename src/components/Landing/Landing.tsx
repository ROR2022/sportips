"use client";
import React from 'react'
import {useTranslations} from 'next-intl';

const Landing = () => {
    const t = useTranslations('HomePage');
  return (
    <div className='text-center'>{t('title')}</div>
  )
}

export default Landing