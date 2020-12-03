"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var likesDislikes_1 = require("../db/likesDislikes");
var authMiddleware_1 = require("../middleware/authMiddleware");
var shared_1 = require("../shared");
var router = express_1.Router();
router.post("/add", authMiddleware_1.checkSessionCookie, function (req, res, next) {
    var user_id = req.session.key;
    var _a = req.body, is_like = _a.is_like, post_id = _a.post_id;
    if (typeof is_like !== "boolean") {
        res.status(400);
        return next(new Error("invalid or missing is_like"));
    }
    if (!shared_1.isPositiveInteger(post_id)) {
        res.status(400);
        return next(new Error("invalid or missing post_id"));
    }
    likesDislikes_1.addLikeDislike(is_like, user_id, post_id)
        .then(function (result) {
        res.json(__assign({ post_id: post_id }, result));
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
exports.default = router;
//# sourceMappingURL=likeDisLikeRouter.js.map