import main from "./parser";
// const tree: Array<child> = main();

const func_arr = main.filter((d) => d.type == "func");

export default main;
