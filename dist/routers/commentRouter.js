"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var comments_1 = require("../db/comments");
var authMiddleware_1 = require("../middleware/authMiddleware");
var shared_1 = require("../shared");
var router = express_1.Router();
router.post("/add_comment", authMiddleware_1.checkSessionCookie, function (req, res, next) {
    var commenter_id = req.session.key;
    var _a = req.body, content = _a.content, post_id = _a.post_id;
    if (!shared_1.isPositiveInteger(post_id)) {
        res.status(400);
        return next(new Error("invalid or missing post_id"));
    }
    if (!content) {
        res.status(400);
        return next(new Error("missing content"));
    }
    comments_1.addComment(commenter_id, post_id, content)
        .then(function (_result) {
        return comments_1.getComment(post_id);
    })
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
router.post("/add_reply", authMiddleware_1.checkSessionCookie, function (req, res, next) {
    var commenter_id = req.session.key;
    var _a = req.body, content = _a.content, reply_to = _a.reply_to, post_id = _a.post_id;
    if (!shared_1.isPositiveInteger(post_id)) {
        res.status(400);
        return next(new Error("invalid or missing post_id"));
    }
    if (!content) {
        res.status(400);
        return next(new Error("missing content"));
    }
    if (!shared_1.isPositiveInteger(reply_to)) {
        res.status(400);
        return next(new Error("invalid or missing reply_to"));
    }
    comments_1.addReply(commenter_id, post_id, content, reply_to)
        .then(function (_result) {
        return comments_1.getReply(post_id, reply_to);
    })
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
router.get("/get/:post_id", function (req, res, next) {
    var post_id = req.params.post_id;
    if (!shared_1.isPositiveIntegerString(post_id)) {
        res.status(400);
        return next(new Error("invalid or missing post_id"));
    }
    comments_1.getComment(parseInt(post_id))
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
router.get("/get_reply/:post_id/:comment_id", function (req, res, next) {
    var _a = req.params, post_id = _a.post_id, comment_id = _a.comment_id;
    if (!shared_1.isPositiveIntegerString(post_id) ||
        !shared_1.isPositiveIntegerString(comment_id)) {
        res.status(400);
        return next(new Error("invalid post_id or comment_id"));
    }
    comments_1.getReply(parseInt(post_id), parseInt(comment_id))
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
exports.default = router;
//# sourceMappingURL=commentRouter.js.map