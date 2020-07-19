"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_tree_1 = __importDefault(require("./file_tree"));
const fs_1 = __importDefault(require("fs"));
const validator = (valid_tree) => {
    const uniqueArray = valid_tree.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return (index ===
            valid_tree.findIndex((obj) => {
                return JSON.stringify(obj) === _thing;
            }));
    });
    return uniqueArray;
};
let tree = [];
const main = (sample) => {
    // sample = skipSpace(sample);
    sample.split("\n").forEach((line, lineNum) => {
        const token = {
            keyword: "",
            type: "",
            operator: "",
            scope: "main",
            prop: {
                name: "",
                value: "",
            },
        };
        let match;
        if (/\s*var\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line) &&
            (match = /\s*var\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line))) {
            const full = match[0].trim();
            const broken_syntax = full.split(/\s*(.+?)\:(.*?)\s*(=|\+=)\s*(.*)\s*/);
            token.keyword = "var";
            token.type = broken_syntax[1].split(" ")[1];
            token.operator = broken_syntax[3];
            token.prop = {
                name: broken_syntax[2],
                value: broken_syntax[4],
            };
            tree.push(token);
        }
        if (/\s*mut\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line) &&
            (match = /\s*mut\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line))) {
            const full = match[0].trim();
            const broken_syntax = full.split(/\s*(.+?)\:(.*?)\s*(=|\+=)\s*(.*)\s*/);
            token.keyword = "mut";
            token.operator = broken_syntax[3];
            token.scope = "global";
            token.prop = {
                name: broken_syntax[2],
                value: broken_syntax[4],
            };
            tree.push(token);
        }
        if (/\s*var\s*(func)\:(.*?)\s*=\s{((.*?)}|\n|\s*)\s*/.exec(line) &&
            (match = /\s*var\s*(func)\:(.*?)\s*=\s{((.*?)}|\n|\s*)(\s*|\s*\n)/.exec(line))) {
            const func = sample.trim().match(/\s*var\s*(func)\:(.*?)\s*=\s{(?:\r|\n|.)+}\s*/gm
            // /\s*var\s*(func)\:(.*?)\s*=\s{((.*?)}|\n|\s*)(.*)(\n*|\s*)}\s*/gm
            );
            func?.forEach(async (data) => {
                const full_func = data.split("\n").join("");
                const func_callback = full_func
                    .trim()
                    .split(/\s*var\s*func\:(.*?)\s*=\s{(.*)}/);
                token.keyword = "var";
                token.type = "func";
                token.operator = "=";
                token.prop = {
                    name: func_callback[1],
                    value: func_callback[2],
                };
                const data_for_main = data.split("\n");
                data_for_main.splice(0, 1);
                data_for_main.splice(data_for_main.length - 1, 1);
                let out = main(data_for_main.join("\n"));
                out = validator(out);
                const scope = [];
                const newTree = out.forEach(async (d) => {
                    scope.push(d);
                    token.inScope = JSON.parse(JSON.stringify(scope));
                    // tree.splice(tree.indexOf(d), 1);
                    // tree.scope = token.prop.name;
                    // tree.push(token);
                });
            });
        }
    });
    return tree;
};
file_tree_1.default.forEach((f) => {
    let innerText = fs_1.default.readFileSync(f, "utf-8");
    const syntax = main(innerText);
    const valid_tree = validator(syntax);
    tree = valid_tree;
});
console.log(tree);
exports.default = tree;
