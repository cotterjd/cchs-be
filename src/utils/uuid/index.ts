import { v4 as uuid } from "uuid";

const uuidStore = {};

export function getCode(email) {
  if (
    !uuidStore[email] ||
    !uuidStore[email].date ||
    hasExpired(uuidStore[email].date)
  ) {
    const code = uuid();
    uuidStore[email] = { code, date: Date.now() };
  }
  return uuidStore[email].code;
}

export function validateCode(email, code) {
  return (
    uuidStore[email] &&
    uuidStore[email].date &&
    !hasExpired(uuidStore[email].date && uuidStore[email].code === code)
  );
}

function hasExpired(date): boolean {
  return Math.abs(date - Date.now()) / 36e5 > 2; // expired if older than 2 hours
}
