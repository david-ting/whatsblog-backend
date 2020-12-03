import bycrpyt from "bcrypt";
import { escapedStr, pool } from "./index";

export const insertUser = async (user: {
  name: string;
  email: string;
  profile_url: null | string;
  password: string;
}) => {
  try {
    const hashedPassword = await bycrpyt.hash(user.password, 10);
    const result = await pool.query(
      `INSERT INTO users (user_id, name, email, profile_url, password) VALUES (
        DEFAULT, 
        '${escapedStr(user.name.trim())}', 
        '${escapedStr(user.email.trim().toLowerCase())}', 
        ${
          user.profile_url === null
            ? "NULL"
            : `'${escapedStr(user.profile_url)}'`
        },
        '${escapedStr(hashedPassword)}') RETURNING user_id`
    );
    if (result.rows[0] === undefined) {
      throw new Error("unable to create user");
    }
    return Promise.resolve(result.rows[0]);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const validateUser = async (
  key: "email" | "name" | "user_id",
  user: { identity: string; password: string }
) => {
  try {
    const res = await pool.query(
      `SELECT user_id, name, email, profile_url, password FROM users WHERE ${key}='${escapedStr(
        user.identity.trim()
      )}'`
    );

    if (res.rows[0] === undefined) {
      throw new Error(`${key} not found`);
    }
    const { user_id, name, email, profile_url } = res.rows[0];

    const match = await bycrpyt.compare(user.password, res.rows[0].password);
    if (match) {
      return Promise.resolve({
        user_id,
        name,
        email,
        profile_url,
      });
    } else {
      throw new Error("password is not valid");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUser = async (user_id: number) => {
  try {
    const res = await pool.query(
      `SELECT name, email, profile_url FROM users WHERE user_id=${user_id}`
    );
    if (res.rows[0] === undefined) {
      throw new Error("user not found");
    } else {
      return Promise.resolve(res.rows[0]);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateUserProfileURL = async (
  user_id: number,
  profile_url: string
) => {
  try {
    const res = await pool.query(
      `UPDATE users SET profile_url='${escapedStr(
        profile_url
      )}' WHERE user_id=${user_id} RETURNING profile_url`
    );
    if (res.rows[0]) {
      return Promise.resolve(res.rows[0]);
    } else {
      throw new Error("unable to update password");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateUserPassword = async (user_id: number, password: string) => {
  try {
    const hashedPassword = await bycrpyt.hash(password, 10);
    const res = await pool.query(
      `UPDATE users SET password='${escapedStr(
        hashedPassword
      )}' WHERE user_id=${user_id} RETURNING user_id`
    );
    if (res.rows[0]) {
      return Promise.resolve(res.rows[0]);
    } else {
      throw new Error("unable to update password");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const checkUniqueness = async (key: "name" | "email", value: string) => {
  try {
    const res = await pool.query(
      `SELECT user_id FROM users WHERE ${key}='${escapedStr(value)}'`
    );
    if (res.rows[0] === undefined) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
