"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const walk = (dir, filelist) => {
    const files = fs_1.default.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file) => {
        if (fs_1.default.statSync(dir + file).isDirectory()) {
            filelist = walk(dir + file + "/", filelist);
        }
        else {
            if (file.includes(".zag")) {
                filelist.push(path_1.default.resolve(dir) + "/" + file);
            }
            else {
                return;
            }
        }
    });
    return filelist;
};
exports.default = walk("./", []);
