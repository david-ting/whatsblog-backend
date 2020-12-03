import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { REDIS_URL, SESSION_SECRET, ENV } from "./shared";
let RedisStore = connectRedis(session);
let redisClient = redis.createClient({
  url: REDIS_URL,
});

import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter";
import postRouter from "./routers/postRouter";
import imageRouter from "./routers/imageRouter";
import likeDislikeRouter from "./routers/likeDisLikeRouter";
import commentRouter from "./routers/commentRouter";
import authorRouter from "./routers/authorRouter";

dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const PORT = process.env.PORT || 8000;

export const app = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.set('trust proxy', 1)
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET as string,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: ENV !== "development",
      sameSite: ENV === "development" ? false : "none",
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);

// Add headers for CORS requests
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// cors preflight request handling
app.options("*", (req, res) => {
  if (req.header("origin") === CLIENT_URL) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/image", imageRouter);
app.use("/like_dislike", likeDislikeRouter);
app.use("/comment", commentRouter);
app.use("/author", authorRouter);

// 404 middleware
app.use((_req, res, next) => {
  res.status(404);
  next(new Error("page not found"));
});

// error handler middleware
app.use(
  (
    err: any,
    _req: any,
    res: {
      status: (arg0: any) => void;
      statusCode: any;
      json: (arg0: { message: string }) => void;
    },
    _next: any
  ) => {
    res.status(res.statusCode || 500);
    res.json({
      message: err.message || "internal server error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`App listening on Port ${PORT}`);
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});
