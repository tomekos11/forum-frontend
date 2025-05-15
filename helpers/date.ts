import { DateTime } from 'luxon';

export const formatDate = (date: string) => {
  return DateTime.fromISO(date).setLocale('pl').toFormat('d LLLL yyyy, HH:mm');
};

export const formatDateShort = (date: string) => {
  return DateTime.fromISO(date).setLocale('pl').toFormat('d LLL yyyy HH:mm');
};