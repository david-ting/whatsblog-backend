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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var posts_1 = require("../db/posts");
var shared_1 = require("../shared");
var router = express_1.default.Router();
router.post("/add", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, _a, title, description, headerImageData, blog_type, content, header_image_url, image;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user_id = req.session.key;
                _a = req.body, title = _a.title, description = _a.description, headerImageData = _a.headerImageData, blog_type = _a.blog_type, content = _a.content;
                if (!user_id) {
                    res.status(401);
                    return [2 /*return*/, next(new Error("unauthorized"))];
                }
                if (!title || !description || !blog_type || !content) {
                    res.status(400);
                    return [2 /*return*/, next(new Error("missing title, description, blog_type or content"))];
                }
                if (!(headerImageData === "")) return [3 /*break*/, 1];
                header_image_url = null;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, shared_1.cloudinary.uploader.upload(headerImageData, {
                    upload_preset: "blog_post_images",
                })];
            case 2:
                image = _b.sent();
                header_image_url = image.secure_url;
                _b.label = 3;
            case 3:
                posts_1.addPost(title, description, header_image_url, blog_type, content, user_id)
                    .then(function (result) {
                    res.json(result);
                })
                    .catch(function (err) {
                    console.error(err);
                    res.status(500);
                    next(new Error("internal server error"));
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/get_by_post_id/:post_id", function (req, res, next) {
    var authenticated_user_id = req.session.key;
    var post_id = req.params.post_id;
    if (!shared_1.isPositiveIntegerString(post_id)) {
        res.status(400);
        next(new Error("invalid post_id"));
    }
    posts_1.getPostByPost_id(parseInt(post_id), authenticated_user_id)
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
router.get("/get_own_posts", function (req, res, next) {
    var authenticated_user_id = req.session.key;
    if (!authenticated_user_id) {
        res.status(401);
        return next(new Error("unauthorized"));
    }
    posts_1.getPostByUser_id(authenticated_user_id, authenticated_user_id)
        .then(function (results) {
        res.json(results);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
router.get("/getAll/:itemsPerPage/:page", function (req, res, next) {
    var authenticated_user_id = req.session.key;
    var _a = req.params, itemsPerPage = _a.itemsPerPage, page = _a.page;
    if (!shared_1.isPositiveIntegerString(itemsPerPage) ||
        !shared_1.isPositiveIntegerString(page)) {
        res.status(400);
        next(new Error("itemsPerPage or page is not integer"));
    }
    posts_1.getAllPosts(parseInt(itemsPerPage), parseInt(page), authenticated_user_id)
        .then(function (results) {
        res.json(results);
    })
        .catch(function (err) {
        console.error(err);
        res.status(500);
        next(new Error("internal server error"));
    });
});
exports.default = router;
//# sourceMappingURL=postRouter.js.map