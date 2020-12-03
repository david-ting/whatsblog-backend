"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReply = exports.getComment = exports.addReply = exports.addComment = void 0;
var index_1 = require("./index");
exports.addComment = function (commenter_id, post_id, content) { return __awaiter(void 0, void 0, void 0, function () {
    var res1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query("INSERT INTO comments (commenter_id, post_id,  content, created_at) VALUES\n        (" + commenter_id + ", " + post_id + ", '" + index_1.escapedStr(JSON.stringify(content)) + "', CURRENT_TIMESTAMP(0)) RETURNING comment_id")];
            case 1:
                res1 = _a.sent();
                if (res1.rows[0]) {
                    return [2 /*return*/, Promise.resolve(res1.rows[0])];
                }
                else {
                    throw new Error("unable to add comment");
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, Promise.reject(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addReply = function (commenter_id, post_id, content, reply_to) { return __awaiter(void 0, void 0, void 0, function () {
    var res1, res2, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.pool.query("INSERT INTO comments (commenter_id, post_id, reply_to, content, created_at) VALUES\n        (" + commenter_id + ", " + post_id + ", " + reply_to + ", \n          '" + index_1.escapedStr(JSON.stringify(content)) + "', CURRENT_TIMESTAMP(0)) RETURNING comment_id")];
            case 1:
                res1 = _a.sent();
                if (!res1.rows[0]) {
                    throw new Error("unable to add comment");
                }
                return [4 /*yield*/, index_1.pool.query("UPDATE comments\n          SET reply_counts = reply_counts + 1 WHERE comment_id=" + reply_to + " RETURNING comment_id")];
            case 2:
                res2 = _a.sent();
                if (res2.rows[0]) {
                    return [2 /*return*/, Promise.resolve(res1.rows[0])];
                }
                else {
                    throw new Error("unable to update comment_counts");
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, Promise.reject(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllComment_SQL = function (post_id, condition) {
    return "SELECT json_build_object (\n    'comment_id', c.comment_id, \n    'commenter_id', c.commenter_id, \n    'post_id', c.post_id, \n    'reply_to', c.reply_to, \n    'content', c.content, \n    'created_at', c.created_at\n    ) AS comment, \n    json_build_object (\n      'user_id', u.user_id, \n      'name', u.name, \n      'profile_url', u.profile_url\n    ) AS commenter,\n    c.reply_counts\n  FROM comments c INNER JOIN users u ON c.commenter_id=u.user_id WHERE c.post_id=" + post_id + "\n  " + condition + "\n  ORDER BY c.created_at DESC";
};
exports.getComment = function (post_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res2, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.pool.query(getAllComment_SQL(post_id, "AND c.reply_to IS NULL"))];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, index_1.pool.query("SELECT COUNT(comment_id) AS comment_counts FROM comments WHERE post_id=" + post_id)];
            case 2:
                res2 = _a.sent();
                return [2 /*return*/, Promise.resolve({
                        comments: res.rows,
                        commentCounts: res2.rows[0].comment_counts,
                    })];
            case 3:
                err_3 = _a.sent();
                return [2 /*return*/, Promise.reject(err_3)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getReply = function (post_id, reply_to) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res2, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.pool.query(getAllComment_SQL(post_id, "AND c.reply_to=" + reply_to))];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, index_1.pool.query("SELECT COUNT(comment_id) FILTER (WHERE reply_to=" + reply_to + ") AS reply_counts, \n      COUNT(comment_id) AS comment_counts\n      FROM comments WHERE post_id=" + post_id)];
            case 2:
                res2 = _a.sent();
                return [2 /*return*/, Promise.resolve({
                        replies: res.rows,
                        replyCounts: res2.rows[0].reply_counts,
                        commentCounts: res2.rows[0].comment_counts,
                    })];
            case 3:
                err_4 = _a.sent();
                return [2 /*return*/, Promise.reject(err_4)];
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=comments.js.map