import files from "./file_tree";
import fs from "fs";
// export interface props {
//     type: string;
//     name: string;
//     value: string | number | boolean;
// }
// export interface child {
//     line: number;
//     keyword: string;
//     props: props;
//     operator: string;
//     scope?: string;
// }

import main from ".";

const validator = (valid_tree: Array<object>): Array<object> => {
    const uniqueArray = valid_tree.filter((thing: object, index: number) => {
        const _thing = JSON.stringify(thing);
        return (
            index ===
            valid_tree.findIndex((obj) => {
                return JSON.stringify(obj) === _thing;
            })
        );
    });
    return uniqueArray;
};
let tree: Array<object> = [];

const main = (sample: string) => {
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
        if (
            /\s*var\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line) &&
            (match = /\s*var\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line))
        ) {
            const full = match[0].trim();
            const broken_syntax = full.split(
                /\s*(.+?)\:(.*?)\s*(=|\+=)\s*(.*)\s*/
            );
            token.keyword = "var";
            token.type = broken_syntax[1].split(" ")[1];
            token.operator = broken_syntax[3];
            token.prop = {
                name: broken_syntax[2],
                value: broken_syntax[4],
            };
            tree.push(token);
        }
        if (
            /\s*mut\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line) &&
            (match = /\s*mut\s*(.*)\:(.*?)\s*=\s*(.*)\s*/.exec(line))
        ) {
            const full = match[0].trim();
            const broken_syntax = full.split(
                /\s*(.+?)\:(.*?)\s*(=|\+=)\s*(.*)\s*/
            );
            token.keyword = "mut";
            token.operator = broken_syntax[3];
            token.scope = "global";
            token.prop = {
                name: broken_syntax[2],
                value: broken_syntax[4],
            };
            tree.push(token);
        }
        if (
            /\s*var\s*(func)\:(.*?)\s*=\s{((.*?)}|\n|\s*)\s*/.exec(line) &&
            (match = /\s*var\s*(func)\:(.*?)\s*=\s{((.*?)}|\n|\s*)(\s*|\s*\n)/.exec(
                line
            ))
        ) {
            const func = sample.trim().match(
                /\s*var\s*(func)\:(.*?)\s*=\s{(?:\r|\n|.)+}\s*/gm
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
                const data_for_main: Array<string> = data.split("\n");
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
files.forEach((f: string) => {
    let innerText: string = fs.readFileSync(f, "utf-8");
    const syntax: Array<object> = main(innerText);
    const valid_tree: Array<object> = validator(syntax);
    tree = valid_tree;
});
console.log(tree);
export default tree;
