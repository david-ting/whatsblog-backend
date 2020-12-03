"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_SECRET = exports.REDIS_PASSWORD = exports.REDIS_PORT = exports.REDIS_HOST = exports.cookieOptions = exports.ENV = exports.cloudinary = exports.isPositiveInteger = exports.isPositiveIntegerString = exports.nonEmptyString = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function nonEmptyString(input) {
    return input && typeof input === "string" && input.trim() !== "";
}
exports.nonEmptyString = nonEmptyString;
exports.isPositiveIntegerString = function (input) {
    return typeof input === "string" && /^[1-9][0-9]*$/.test(input);
};
exports.isPositiveInteger = function (input) {
    return Number.isInteger(input) && input > 0;
};
exports.cloudinary = require("cloudinary").v2;
exports.cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.ENV = process.env.NODE_ENV || "development";
exports.cookieOptions = {
    httpOnly: true,
    signed: true,
    secure: exports.ENV !== "development",
    sameSite: exports.ENV === "development" ? false : "none",
};
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT)
    : undefined;
exports.REDIS_PASSWORD = process.env.REDIS_PASSWORD;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
//# sourceMappingURL=shared.js.map