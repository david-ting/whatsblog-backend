import express from "express";
import {
  cookieOptions,
  isPositiveIntegerString,
  nonEmptyString,
} from "../shared";
import {
  getUser,
  insertUser,
  updateUserPassword,
  updateUserProfileURL,
  validateUser,
} from "../db/users";
import { cloudinary } from "../shared";

import {
  checkNameEmail,
  checkPassword,
  checkSessionCookie,
} from "../middleware/authMiddleware";
import { isString } from "../types/typeGuards";

const router = express.Router();

// sign-up route
router.post(
  "/sign-up",
  checkNameEmail,
  checkPassword,
  async (req, res, next) => {
    const { name, email, password, profileData } = req.body;
    try {
      let profile_url: string | null;
      if (profileData === "") {
        profile_url = null;
      } else {
        profile_url = await uploadProfilePic(profileData);
      }

      const result = await insertUser({ name, email, profile_url, password });
      req.session.key = result.user_id;

      const user = await getUser(result.user_id);
      res.json({ message: "success", user: user });
    } catch (err) {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    }
  }
);

// log-in route
router.post(["/log-in/name", "/log-in/email"], (req, res, next) => {
  const { password } = req.body;
  let { name, email } = req.body;

  let key: "name" | "email";
  let identity;
  if (req.url === "/log-in/name") {
    key = "name";
    identity = name;
  } else {
    key = "email";
    identity = email;
  }

  if (!nonEmptyString(identity) || !nonEmptyString(password)) {
    res.status(400);
    return next(new Error(`${key} or password is missing or invalid`));
  }

  validateUser(key, {
    identity: identity,
    password: password,
  })
    .then((result) => {
      const { name, email, profile_url } = result;
      req.session.key = result.user_id;
      res.json({ name, email, profile_url });
    })
    .catch((error) => {
      console.error(error);
      res.status(400);
      next(new Error(`incorrect ${key} or password`));
    });
});

// log-out route
router.post("/log-out", checkSessionCookie, (req, res, next) => {
  // const user_id = req.signedCookies.user_id;
  // if (!isPositiveIntegerString(user_id)) {
  //   res.status(401);
  //   return next(new Error("unauthorized"));
  // }

  // getUser(parseInt(user_id))
  //   .then((_result) => {
  //     res.clearCookie("user_id");
  //     res.json({ message: "logged out successfully" });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(401);
  //     next(new Error("user not found"));
  //   });

  req.session.destroy(function (err) {
    console.error(err);
    if (err === null) {
      res.status(200);
      res.json({ message: "ok" });
    } else {
      res.status(500);
      next(new Error("internal server error"));
    }
  });
});

router.get("/get_user", checkSessionCookie, (req, res, next) => {
  const user_id = req.session.key as number;

  getUser(user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(400);
      next(new Error("user not exists"));
    });
});

router.put(
  "/update_user/profile_url",
  checkSessionCookie,
  async (req, res, next) => {
    try {
      const user_id = req.session.key as number;
      const { profileData } = req.body;

      if (!nonEmptyString(profileData)) {
        res.status(400);
        return next(new Error("invalid or missing profileData"));
      }

      const profile_url = await uploadProfilePic(profileData);
      const result = await updateUserProfileURL(user_id, profile_url);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    }
  }
);

router.put(
  "/update_user/password",
  checkSessionCookie,
  checkPassword,
  async (req, res, next) => {
    try {
      const user_id = req.session.key as number;
      const { currentPassword, password } = req.body;

      if (!isString(currentPassword)) {
        res.status(401);
        return next(new Error("unauthorized"));
      }

      if (!isString(password)) {
        res.status(400);
        return next(new Error("invalid new password"));
      }

      const validCurrentPassword = await validateUser("user_id", {
        identity: user_id.toString(),
        password: currentPassword,
      })
        .then((result) => {
          if (result.user_id === user_id) {
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          console.error(err);
          return false;
        });

      if (!validCurrentPassword) {
        res.status(400);
        return next(new Error("invalid current password"));
      }

      const updateResult = await updateUserPassword(user_id, password);
      if (updateResult.user_id === user_id) {
        res.json({ message: "password changed successfully" });
      } else {
        res.status(500);
        return next(new Error("internal server error"));
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      return next(new Error("internal server error"));
    }
  }
);

const uploadProfilePic = async (profileData: string): Promise<string> => {
  try {
    const res = await cloudinary.uploader.upload(profileData, {
      upload_preset: "user_icons",
    });
    return Promise.resolve(res.secure_url);
  } catch (err) {
    console.error(err);
    return Promise.reject(new Error("unable to upload the image"));
  }
};

export default router;

