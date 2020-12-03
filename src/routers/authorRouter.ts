import express from "express";
import { getPostByUser_id } from "../db/posts";
import { getUser } from "../db/users";
import { isPositiveIntegerString } from "../shared";

const router = express.Router();
router.get("/profile/:user_id", async (req, res, next) => {
  const user_id = req.params.user_id;
  let authenticated_user_id = req.session.key;

  if (!isPositiveIntegerString(user_id)) {
    res.status(400);
    return next(new Error("invalid user_id"));
  }

  try {
    const user = await getUser(parseInt(user_id));
    const posts = await getPostByUser_id(
      parseInt(user_id),
      authenticated_user_id
    );
    res.json({ user, posts });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(new Error("internal server error"));
  }
});

export default router;
