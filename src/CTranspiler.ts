export type SFunction = {
    name: string,
    returnType: String,
    lines: string[],
    parameters: string[]
};

let imports: string[] = [];

let functions: SFunction[] = [{name: "Mrdka", returnType: "void", parameters: [], lines: []}];

let lines: SFunction[] = [];

export function addImport(name: string) {
    imports.push(name);
}

export function containsImport(name: string): boolean {
    return imports.includes(name);
}

export function addLine(line: string) {
    lines[lines.length-1].lines.push(line);
}

export function createFunction(func: SFunction): SFunction {
    functions.push(func);
    return functions[functions.length-1];
}

export function pushFunction(func: SFunction) {
    lines.push(func);
}

export function popFunction() {
    lines.pop();
}

export function buildCode() {
    let imp: string = imports.map(item => item = `#include <${item}.h>`).join("\n");
    let funcDeclarations: string[] = [];
    functions.forEach(func => {
        funcDeclarations.push(`${func.returnType} ${func.name}(${func.parameters.join(", ")});`);
    });
    console.log(funcDeclarations);
    let funcImplementations: string[] = [];

    functions.forEach(func => {
        let _func: string[] = [];
        _func.push(`${func.returnType} ${func.name}(${func.parameters.join(", ")}) {`);
        _func.push(func.lines.join("\n"));
        _func.push("}");
        funcImplementations.push(_func.join("\n"));
    });

    return imp + '\n' + funcDeclarations.join("\n") + "\n" + funcImplementations.join("\n");
}

export async function compile(code: string) {
    let fs = await import("fs");
    const { exec, spawn } = require('child_process');

    fs.writeFileSync("out.c", code, {encoding: "utf-8"});
    exec("gcc -o output out.c -O3", () => {
        //fs.unlinkSync("out.c");
    });
}