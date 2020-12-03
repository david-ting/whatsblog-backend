import express from "express";
import { cloudinary } from "../shared";

const router = express.Router();
router.post("/", async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.data, {
      upload_preset: "blog_post_images",
    });
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500);
    next(new Error("image cannot be uploaded"));
  }
});

export default router;
