import {getRequestConfig} from 'next-intl/server';
//import {cookies} from 'next-intl/server';
//import Cookies from 'js-cookie';
import { getUserLocale } from '@/services/locale';
 
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const myCookie = await getUserLocale();
  //console.log('myCookie request.ts:.. ', myCookie)
  const locale = myCookie || 'en';
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});