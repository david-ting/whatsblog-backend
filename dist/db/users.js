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
exports.checkUniqueness = exports.updateUserPassword = exports.updateUserProfileURL = exports.getUser = exports.validateUser = exports.insertUser = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var index_1 = require("./index");
exports.insertUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, bcrypt_1.default.hash(user.password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, index_1.pool.query("INSERT INTO users (user_id, name, email, profile_url, password) VALUES (\n        DEFAULT, \n        '" + index_1.escapedStr(user.name.trim()) + "', \n        '" + index_1.escapedStr(user.email.trim().toLowerCase()) + "', \n        " + (user.profile_url === null
                        ? "NULL"
                        : "'" + index_1.escapedStr(user.profile_url) + "'") + ",\n        '" + index_1.escapedStr(hashedPassword) + "') RETURNING user_id")];
            case 2:
                result = _a.sent();
                if (result.rows[0] === undefined) {
                    throw new Error("unable to create user");
                }
                return [2 /*return*/, Promise.resolve(result.rows[0])];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, Promise.reject(err_1)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.validateUser = function (key, user) { return __awaiter(void 0, void 0, void 0, function () {
    var res, _a, user_id, name_1, email, profile_url, match, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.pool.query("SELECT user_id, name, email, profile_url, password FROM users WHERE " + key + "='" + index_1.escapedStr(user.identity.trim()) + "'")];
            case 1:
                res = _b.sent();
                if (res.rows[0] === undefined) {
                    throw new Error(key + " not found");
                }
                _a = res.rows[0], user_id = _a.user_id, name_1 = _a.name, email = _a.email, profile_url = _a.profile_url;
                return [4 /*yield*/, bcrypt_1.default.compare(user.password, res.rows[0].password)];
            case 2:
                match = _b.sent();
                if (match) {
                    return [2 /*return*/, Promise.resolve({
                            user_id: user_id,
                            name: name_1,
                            email: email,
                            profile_url: profile_url,
                        })];
                }
                else {
                    throw new Error("password is not valid");
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                return [2 /*return*/, Promise.reject(err_2)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUser = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query("SELECT name, email, profile_url FROM users WHERE user_id=" + user_id)];
            case 1:
                res = _a.sent();
                if (res.rows[0] === undefined) {
                    throw new Error("user not found");
                }
                else {
                    return [2 /*return*/, Promise.resolve(res.rows[0])];
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, Promise.reject(err_3)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserProfileURL = function (user_id, profile_url) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query("UPDATE users SET profile_url='" + index_1.escapedStr(profile_url) + "' WHERE user_id=" + user_id + " RETURNING profile_url")];
            case 1:
                res = _a.sent();
                if (res.rows[0]) {
                    return [2 /*return*/, Promise.resolve(res.rows[0])];
                }
                else {
                    throw new Error("unable to update password");
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, Promise.reject(err_4)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserPassword = function (user_id, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, res, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, index_1.pool.query("UPDATE users SET password='" + index_1.escapedStr(hashedPassword) + "' WHERE user_id=" + user_id + " RETURNING user_id")];
            case 2:
                res = _a.sent();
                if (res.rows[0]) {
                    return [2 /*return*/, Promise.resolve(res.rows[0])];
                }
                else {
                    throw new Error("unable to update password");
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                return [2 /*return*/, Promise.reject(err_5)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.checkUniqueness = function (key, value) { return __awaiter(void 0, void 0, void 0, function () {
    var res, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.pool.query("SELECT user_id FROM users WHERE " + key + "='" + index_1.escapedStr(value) + "'")];
            case 1:
                res = _a.sent();
                if (res.rows[0] === undefined) {
                    return [2 /*return*/, Promise.resolve(true)];
                }
                else {
                    return [2 /*return*/, Promise.resolve(false)];
                }
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                return [2 /*return*/, Promise.reject(err_6)];
            case 3: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=users.js.map