import { CookieOptions } from "express";
import { CookieOptions as SessionCookieOptions } from "express-session";
import dotenv from "dotenv";
dotenv.config();

export function nonEmptyString(input: any): input is string {
  return input && typeof input === "string" && input.trim() !== "";
}

export const isPositiveIntegerString = (input: any): input is string => {
  return typeof input === "string" && /^[1-9][0-9]*$/.test(input);
};

export const isPositiveInteger = (input: any): input is number => {
  return Number.isInteger(input) && input > 0;
};

export const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const ENV = process.env.NODE_ENV || "development";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  signed: true,
  secure: ENV !== "development",
  sameSite: ENV === "development" ? false : "none",
};

export const REDIS_URL = process.env.REDIS_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
