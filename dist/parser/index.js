"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
// const tree: Array<child> = main();
const func_arr = parser_1.default.filter((d) => d.type == "func");
exports.default = parser_1.default;
