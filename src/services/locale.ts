'use server';

import {cookies} from 'next/headers';


// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'langSelected';
const defaultLocale = 'en';

export async function getUserLocale() {
    const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: string) {
    const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
}