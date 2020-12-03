import { NextFunction, Request, Response } from "express";
import { checkUniqueness } from "../db/users";
import { nonEmptyString } from "../shared";

// acts as a middleware for signing up
export const checkNameEmail = async (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => {
  const { name, email } = req.body;
  try {
    if (!nonEmptyString(name)) {
      res.status(400);
      return next(new Error("name is missing"));
    }
    if (!nonEmptyString(email)) {
      res.status(400);
      return next(new Error("email is missing"));
    }

    const uniqueName = await checkUniqueness("name", name);
    if (!uniqueName) {
      res.status(400);
      return next(new Error("name is in use"));
    }
    const uniqueEmail = await checkUniqueness("email", email);
    if (!uniqueEmail) {
      res.status(400);
      return next(new Error("email is in use"));
    }
    return next();
  } catch (err) {
    console.error(err);
    res.status(500);
    return next(new Error("Internal server error"));
  }
};

export const checkPassword = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => {
  const { password } = req.body;

  if (!nonEmptyString(password)) {
    res.status(400);
    return next(new Error("password is missing"));
  }
  if (password.length < 8) {
    res.status(400);
    return next(new Error("password rules are not fulfilled"));
  }

  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    res.status(400);
    return next(new Error("password rules are not fulfilled"));
  }

  if (/^\s/.test(password) || /\s$/.test(password)) {
    res.status(400);
    return next(new Error("password rules are not fulfilled"));
  }

  return next();
};

export const checkSessionCookie = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => {
  const user_id = req.session.key;
  if (!user_id) {
    res.status(401);
    return next(new Error("unauthorized"));
  }
  return next();
};
