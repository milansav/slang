import {readFileSync} from "fs";
import {parse} from "./parser";

interface ConsoleArguments {
    files: {
        name: string,
    }[]
}

let sourceCode = readFileSync(process.argv[2], {encoding: "utf-8"});

function tokenize(input: string) {
    let regex: RegExp = /(\w+)|(\.\w+)|([=+\-*\/%:(){}><]+)/g;
    // @ts-ignore
    let tokens: any = input.match(regex);
    console.log(tokens);
    return tokens;
}

let tokens: string[] = tokenize(sourceCode);

parse(tokens);
