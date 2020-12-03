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
exports.getPostByUser_id = exports.getPostByPost_id = exports.getAllPosts = exports.addPost = void 0;
var index_1 = require("./index");
exports.addPost = function (title, description, header_image_url, blog_type, content, user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query("INSERT INTO posts \n      (title, description, header_image_url, blog_type, content, created_at, modified_at, user_id) \n      VALUES \n      ( '" + index_1.escapedStr(title) + "',\n        '" + index_1.escapedStr(description) + "',\n        " + (header_image_url === null
                        ? "NULL"
                        : "'" + index_1.escapedStr(header_image_url) + "'") + ",\n        '" + blog_type + "',\n        '" + index_1.escapedStr(JSON.stringify(content)) + "', CURRENT_TIMESTAMP(0), CURRENT_TIMESTAMP(0), " + user_id + ")\n      RETURNING post_id")];
            case 1:
                res = _a.sent();
                if (res.rows[0] !== undefined && !isNaN(res.rows[0].post_id)) {
                    return [2 /*return*/, Promise.resolve({ post_id: res.rows[0].post_id })];
                }
                else {
                    throw new Error("unable to add the post");
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, Promise.reject(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAllPosts_SQL = function (condition, authenticated_user_id, itemsPerPage, page) {
    return "\n--posts_likes_dislikes_joined\n  WITH f AS\n    (SELECT \n      p.user_id, \n      p.post_id,\n      json_build_object(\n      'post_id', p.post_id,\n      'title', p.title,\n      'description', p.description,\n      'header_image_url', p.header_image_url,\n      'blog_type', p.blog_type,\n      'content', p.content,\n      'created_at', p.created_at,\n      'modified_at', p.modified_at\n      ) AS post,\n      COUNT(is_like) FILTER (WHERE is_like=true) AS like_counts,\n      COUNT(is_like) FILTER (WHERE is_like=false) AS dislike_counts\n      FROM posts p LEFT JOIN likes_dislikes\n      ON p.post_id=likes_dislikes.post_id\n      " + condition + "\n      GROUP BY p.post_id\n    )" + (!authenticated_user_id
        ? ""
        : ",s AS (\n      SELECT \n      p.post_id, \n      CASE\n        WHEN " + authenticated_user_id + " \n          = ANY(ARRAY_AGG(l.user_id) FILTER (WHERE l.user_id=" + authenticated_user_id + " AND l.is_like=true)) \n        THEN true\n        WHEN " + authenticated_user_id + " \n          = ANY(ARRAY_AGG(l.user_id) FILTER (WHERE l.user_id=" + authenticated_user_id + " AND l.is_like=false)) \n        THEN false\n        ELSE null\n      END AS current_user_is_like\n      FROM posts p LEFT JOIN likes_dislikes l USING(post_id) GROUP BY p.post_id\n    )") + "\n--posts_comments_joined\n    , t AS (\n      SELECT p.post_id, COUNT(c.comment_id) AS comment_counts\n      FROM posts p LEFT JOIN comments c USING(post_id) \n      GROUP BY p.post_id\n    )\n    \n--posts_likes_dislikes_comments_users_joined\n    SELECT f.post_id, f.post, f.like_counts, f.dislike_counts, \n      json_build_object(\n      'user_id', a.user_id, \n      'name', a.name,\n      'profile_url', a.profile_url\n    ) AS author,\n    t.comment_counts\n    " + (!authenticated_user_id ? "" : ", s.current_user_is_like") + "\n    FROM f \n      INNER JOIN t USING(post_id)\n      INNER JOIN users a USING(user_id)\n    " + (!authenticated_user_id ? "" : "INNER JOIN s USING(post_id)") + "\n    ORDER BY f.post_id DESC\n    " + (page && itemsPerPage
        ? "LIMIT " + itemsPerPage + " OFFSET " + (page - 1) * itemsPerPage
        : "") + "\n";
};
exports.getAllPosts = function (itemsPerPage, page, authenticated_user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res2, total, pagination, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.pool.query(getAllPosts_SQL("", authenticated_user_id, itemsPerPage, page))];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, index_1.pool.query("SELECT COUNT(post_id) AS total FROM posts")];
            case 2:
                res2 = _a.sent();
                total = parseInt(res2.rows[0].total);
                pagination = {
                    total: total,
                    itemsPerPage: itemsPerPage,
                    page: page,
                    totalPages: Math.ceil(total / itemsPerPage),
                };
                if (res.rows.length > 0) {
                    return [2 /*return*/, Promise.resolve({ pagination: pagination, results: res.rows })];
                }
                else {
                    throw new Error("unable to get posts");
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, Promise.reject(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPostByPost_id = function (post_id, authenticated_user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query(getAllPosts_SQL("WHERE p.post_id=" + post_id, authenticated_user_id))];
            case 1:
                res = _a.sent();
                if (res.rows[0] !== undefined) {
                    return [2 /*return*/, Promise.resolve(res.rows[0])];
                }
                else {
                    throw new Error("unable to get post");
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, Promise.reject(err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPostByUser_id = function (user_id, authenticated_user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query(getAllPosts_SQL("WHERE p.user_id=" + user_id, authenticated_user_id))];
            case 1:
                res = _a.sent();
                return [2 /*return*/, Promise.resolve(res.rows)];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, Promise.reject(err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=posts.js.map