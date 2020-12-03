import { Router } from "express";
import { addLikeDislike } from "../db/likesDislikes";
import { checkSessionCookie } from "../middleware/authMiddleware";
import { isPositiveInteger, isPositiveIntegerString } from "../shared";

const router = Router();

router.post("/add", checkSessionCookie, (req, res, next) => {
  const user_id = req.session.key as number;
  const { is_like, post_id } = req.body;

  if (typeof is_like !== "boolean") {
    res.status(400);
    return next(new Error("invalid or missing is_like"));
  }
  if (!isPositiveInteger(post_id)) {
    res.status(400);
    return next(new Error("invalid or missing post_id"));
  }
  addLikeDislike(is_like, user_id, post_id)
    .then((result) => {
      res.json({ post_id, ...result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

export default router;
