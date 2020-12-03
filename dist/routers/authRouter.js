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
var shared_1 = require("../shared");
var users_1 = require("../db/users");
var shared_2 = require("../shared");
var authMiddleware_1 = require("../middleware/authMiddleware");
var typeGuards_1 = require("../types/typeGuards");
var router = express_1.default.Router();
// sign-up route
router.post("/sign-up", authMiddleware_1.checkNameEmail, authMiddleware_1.checkPassword, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, profileData, profile_url, result, user, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, profileData = _a.profileData;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                profile_url = void 0;
                if (!(profileData === "")) return [3 /*break*/, 2];
                profile_url = null;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, uploadProfilePic(profileData)];
            case 3:
                profile_url = _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, users_1.insertUser({ name: name, email: email, profile_url: profile_url, password: password })];
            case 5:
                result = _b.sent();
                req.session.key = result.user_id;
                return [4 /*yield*/, users_1.getUser(result.user_id)];
            case 6:
                user = _b.sent();
                res.json({ message: "success", user: user });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500);
                next(new Error("internal server error"));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// log-in route
router.post(["/log-in/name", "/log-in/email"], function (req, res, next) {
    var password = req.body.password;
    var _a = req.body, name = _a.name, email = _a.email;
    var key;
    var identity;
    if (req.url === "/log-in/name") {
        key = "name";
        identity = name;
    }
    else {
        key = "email";
        identity = email;
    }
    if (!shared_1.nonEmptyString(identity) || !shared_1.nonEmptyString(password)) {
        res.status(400);
        return next(new Error(key + " or password is missing or invalid"));
    }
    users_1.validateUser(key, {
        identity: identity,
        password: password,
    })
        .then(function (result) {
        var name = result.name, email = result.email, profile_url = result.profile_url;
        req.session.key = result.user_id;
        res.json({ name: name, email: email, profile_url: profile_url });
    })
        .catch(function (error) {
        console.error(error);
        res.status(400);
        next(new Error("incorrect " + key + " or password"));
    });
});
// log-out route
router.post("/log-out", authMiddleware_1.checkSessionCookie, function (req, res, next) {
    // const user_id = req.signedCookies.user_id;
    // if (!isPositiveIntegerString(user_id)) {
    //   res.status(401);
    //   return next(new Error("unauthorized"));
    // }
    // getUser(parseInt(user_id))
    //   .then((_result) => {
    //     res.clearCookie("user_id");
    //     res.json({ message: "logged out successfully" });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     res.status(401);
    //     next(new Error("user not found"));
    //   });
    req.session.destroy(function (err) {
        console.error(err);
        if (err === null) {
            res.status(200);
            res.json({ message: "ok" });
        }
        else {
            res.status(500);
            next(new Error("internal server error"));
        }
    });
});
router.get("/get_user", authMiddleware_1.checkSessionCookie, function (req, res, next) {
    var user_id = req.session.key;
    users_1.getUser(user_id)
        .then(function (result) {
        res.json(result);
    })
        .catch(function (err) {
        console.error(err);
        res.status(400);
        next(new Error("user not exists"));
    });
});
router.put("/update_user/profile_url", authMiddleware_1.checkSessionCookie, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, profileData, profile_url, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_id = req.session.key;
                profileData = req.body.profileData;
                if (!shared_1.nonEmptyString(profileData)) {
                    res.status(400);
                    return [2 /*return*/, next(new Error("invalid or missing profileData"))];
                }
                return [4 /*yield*/, uploadProfilePic(profileData)];
            case 1:
                profile_url = _a.sent();
                return [4 /*yield*/, users_1.updateUserProfileURL(user_id, profile_url)];
            case 2:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                res.status(500);
                next(new Error("internal server error"));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/update_user/password", authMiddleware_1.checkSessionCookie, authMiddleware_1.checkPassword, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id_1, _a, currentPassword, password, validCurrentPassword, updateResult, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                user_id_1 = req.session.key;
                _a = req.body, currentPassword = _a.currentPassword, password = _a.password;
                if (!typeGuards_1.isString(currentPassword)) {
                    res.status(401);
                    return [2 /*return*/, next(new Error("unauthorized"))];
                }
                if (!typeGuards_1.isString(password)) {
                    res.status(400);
                    return [2 /*return*/, next(new Error("invalid new password"))];
                }
                return [4 /*yield*/, users_1.validateUser("user_id", {
                        identity: user_id_1.toString(),
                        password: currentPassword,
                    })
                        .then(function (result) {
                        if (result.user_id === user_id_1) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    })
                        .catch(function (err) {
                        console.error(err);
                        return false;
                    })];
            case 1:
                validCurrentPassword = _b.sent();
                if (!validCurrentPassword) {
                    res.status(400);
                    return [2 /*return*/, next(new Error("invalid current password"))];
                }
                return [4 /*yield*/, users_1.updateUserPassword(user_id_1, password)];
            case 2:
                updateResult = _b.sent();
                if (updateResult.user_id === user_id_1) {
                    res.json({ message: "password changed successfully" });
                }
                else {
                    res.status(500);
                    return [2 /*return*/, next(new Error("internal server error"))];
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.error(err_3);
                res.status(500);
                return [2 /*return*/, next(new Error("internal server error"))];
            case 4: return [2 /*return*/];
        }
    });
}); });
var uploadProfilePic = function (profileData) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, shared_2.cloudinary.uploader.upload(profileData, {
                        upload_preset: "user_icons",
                    })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, Promise.resolve(res.secure_url)];
            case 2:
                err_4 = _a.sent();
                console.error(err_4);
                return [2 /*return*/, Promise.reject(new Error("unable to upload the image"))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.default = router;
//# sourceMappingURL=authRouter.js.map