"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.escapedStr = void 0;
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var DB_CONNECTION = process.env.DB_CONNECTION;
exports.escapedStr = function (str) {
    return str.replace(/'/g, "''");
};
exports.pool = new pg_1.Pool({
    connectionString: DB_CONNECTION,
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.pool.on("error", function (err, client) {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});
//# sourceMappingURL=index.js.map