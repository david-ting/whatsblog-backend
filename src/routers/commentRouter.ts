import { Router } from "express";
import { addComment, addReply, getComment, getReply } from "../db/comments";
import { checkSessionCookie } from "../middleware/authMiddleware";
import { isPositiveInteger, isPositiveIntegerString } from "../shared";

const router = Router();

router.post("/add_comment", checkSessionCookie, (req, res, next) => {
  const commenter_id = req.session.key as number;
  const { content, post_id } = req.body;

  if (!isPositiveInteger(post_id)) {
    res.status(400);
    return next(new Error("invalid or missing post_id"));
  }
  if (!content) {
    res.status(400);
    return next(new Error("missing content"));
  }

  addComment(commenter_id, post_id, content)
    .then((_result) => {
      return getComment(post_id);
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.post("/add_reply", checkSessionCookie, (req, res, next) => {
  const commenter_id = req.session.key as number;
  const { content, reply_to, post_id } = req.body;

  if (!isPositiveInteger(post_id)) {
    res.status(400);
    return next(new Error("invalid or missing post_id"));
  }
  if (!content) {
    res.status(400);
    return next(new Error("missing content"));
  }
  if (!isPositiveInteger(reply_to)) {
    res.status(400);
    return next(new Error("invalid or missing reply_to"));
  }

  addReply(commenter_id, post_id, content, reply_to)
    .then((_result) => {
      return getReply(post_id, reply_to);
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.get("/get/:post_id", (req, res, next) => {
  const post_id = req.params.post_id;
  if (!isPositiveIntegerString(post_id)) {
    res.status(400);
    return next(new Error("invalid or missing post_id"));
  }

  getComment(parseInt(post_id))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.get("/get_reply/:post_id/:comment_id", (req, res, next) => {
  const { post_id, comment_id } = req.params;

  if (
    !isPositiveIntegerString(post_id) ||
    !isPositiveIntegerString(comment_id)
  ) {
    res.status(400);
    return next(new Error("invalid post_id or comment_id"));
  }

  getReply(parseInt(post_id), parseInt(comment_id))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

export default router;
