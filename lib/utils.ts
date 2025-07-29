import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// import jalaliday from "jalaliday";
import jalaliday from 'jalali-plugin-dayjs';
import JSEncrypt from "jsencrypt";
import timezone from "dayjs/plugin/timezone";
import moment from "jalali-moment";

dayjs.extend(jalaliday);
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("Etc/GMT-3:30");
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertDate(date: string) {
  const convertedDate = dayjs(date + "Z")
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/M/DD");
  return convertedDate;
}

export function convertFullTime(date: string) {
  const convertedDate = dayjs(date + "Z")
    .calendar("jalali")
    .locale("fa")
    .format(" HH:mm - YYYY/M/D");
  return convertedDate;
}

export function Decrypt(encryptedData: any, privateKey: any) {
  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);
  const decrypted = decryptor.decrypt(encryptedData);
  return decrypted;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

