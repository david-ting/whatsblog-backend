import express from "express";
import {
  addPost,
  getAllPosts,
  getPostByPost_id,
  getPostByUser_id,
} from "../db/posts";
import { cloudinary, isPositiveIntegerString } from "../shared";
const router = express.Router();

router.post("/add", async (req, res, next) => {
  const user_id = req.session.key;
  const { title, description, headerImageData, blog_type, content } = req.body;

  if (!user_id) {
    res.status(401);
    return next(new Error("unauthorized"));
  }
  if (!title || !description || !blog_type || !content) {
    res.status(400);
    return next(new Error("missing title, description, blog_type or content"));
  }

  let header_image_url: string | null;
  if (headerImageData === "") {
    header_image_url = null;
  } else {
    const image = await cloudinary.uploader.upload(headerImageData, {
      upload_preset: "blog_post_images",
    });
    header_image_url = image.secure_url;
  }

  addPost(title, description, header_image_url, blog_type, content, user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.get("/get_by_post_id/:post_id", (req, res, next) => {
  let authenticated_user_id = req.session.key;
  const post_id = req.params.post_id;

  if (!isPositiveIntegerString(post_id)) {
    res.status(400);
    next(new Error("invalid post_id"));
  }

  getPostByPost_id(parseInt(post_id), authenticated_user_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.get("/get_own_posts", (req, res, next) => {
  let authenticated_user_id = req.session.key;

  if (!authenticated_user_id) {
    res.status(401);
    return next(new Error("unauthorized"));
  }

  getPostByUser_id(authenticated_user_id, authenticated_user_id)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

router.get("/getAll/:itemsPerPage/:page", (req, res, next) => {
  let authenticated_user_id = req.session.key;

  const { itemsPerPage, page } = req.params;

  if (
    !isPositiveIntegerString(itemsPerPage) ||
    !isPositiveIntegerString(page)
  ) {
    res.status(400);
    next(new Error("itemsPerPage or page is not integer"));
  }

  getAllPosts(parseInt(itemsPerPage), parseInt(page), authenticated_user_id)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
      next(new Error("internal server error"));
    });
});

export default router;
