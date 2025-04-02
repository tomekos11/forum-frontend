import { DateTime } from "luxon";

export const formatDate = (date: string) => {
    console.log(DateTime.fromISO(date))
    return DateTime.fromISO(date).setLocale('pl').toFormat("d LLLL yyyy, HH:mm");
  }