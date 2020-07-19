import fs from "fs";
import path from "path";

const walk = (dir: string, filelist: Array<string>) => {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file: string) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walk(dir + file + "/", filelist);
        } else {
            if (file.includes(".zag")) {
                filelist.push(path.resolve(dir) + "/" + file);
            } else {
                return;
            }
        }
    });
    return filelist;
};
export default walk("./", []);
