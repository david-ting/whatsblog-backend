"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var redis_1 = __importDefault(require("redis"));
var express_session_1 = __importDefault(require("express-session"));
var connect_redis_1 = __importDefault(require("connect-redis"));
var shared_1 = require("./shared");
var RedisStore = connect_redis_1.default(express_session_1.default);
var redisClient = redis_1.default.createClient({
    port: shared_1.REDIS_PORT,
    host: shared_1.REDIS_HOST,
    password: shared_1.REDIS_PASSWORD,
});
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var authRouter_1 = __importDefault(require("./routers/authRouter"));
var postRouter_1 = __importDefault(require("./routers/postRouter"));
var imageRouter_1 = __importDefault(require("./routers/imageRouter"));
var likeDisLikeRouter_1 = __importDefault(require("./routers/likeDisLikeRouter"));
var commentRouter_1 = __importDefault(require("./routers/commentRouter"));
var authorRouter_1 = __importDefault(require("./routers/authorRouter"));
dotenv_1.default.config();
var CLIENT_URL = process.env.CLIENT_URL;
var COOKIE_SECRET = process.env.COOKIE_SECRET;
var PORT = process.env.PORT || 8000;
exports.app = express_1.default();
exports.app.use(body_parser_1.default.json({ limit: "20mb" }));
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(cookie_parser_1.default(COOKIE_SECRET));
exports.app.use(express_session_1.default({
    store: new RedisStore({ client: redisClient }),
    secret: shared_1.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: shared_1.ENV !== "development",
        sameSite: shared_1.ENV === "development" ? false : "none",
        maxAge: 1 * 60 * 60 * 1000,
    },
}));
// Add headers for CORS requests
exports.app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", CLIENT_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
// cors preflight request handling
exports.app.options("*", function (req, res) {
    if (req.header("origin") === CLIENT_URL) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(401);
    }
});
exports.app.use("/auth", authRouter_1.default);
exports.app.use("/post", postRouter_1.default);
exports.app.use("/image", imageRouter_1.default);
exports.app.use("/like_dislike", likeDisLikeRouter_1.default);
exports.app.use("/comment", commentRouter_1.default);
exports.app.use("/author", authorRouter_1.default);
// 404 middleware
exports.app.use(function (_req, res, next) {
    res.status(404);
    next(new Error("page not found"));
});
// error handler middleware
exports.app.use(function (err, _req, res, _next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message || "internal server error",
    });
});
exports.app.listen(PORT, function () {
    console.log("App listening on Port " + PORT);
});
//# sourceMappingURL=index.js.map