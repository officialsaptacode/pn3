import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['ne', 'en'],
  defaultLocale: 'ne',
  // Configure whether to prefix the default locale or not
  localePrefix: 'as-needed'
});
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
