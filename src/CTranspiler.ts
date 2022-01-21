let imports: string[] = [];

let CMainStart: string[] = [
    "int main(int argc, char** argv)",
    "{",
];

let CMainEnd: string[] = [
  "return 0;",
  "}"
];

let lines: string[] = [];

export function addImport(name: string) {
    imports.push(name);
}

export function containsImport(name: string): boolean {
    return imports.includes(name);
}

export function addLine(line: string) {
    lines.push(line);
}

export function buildCode() {
    let imp = imports.map(item => item = `#include <${item}.h>`).join("\n");
    let cmb = CMainStart.join("\n");
    let l = lines.join("\n");
    let cme = CMainEnd.join("\n");
    return imp + "\n" + cmb + "\n" + l + "\n" + cme;
}

export async function compile(code: string) {
    let fs = await import("fs");
    const { exec, spawn } = require('child_process');

    fs.writeFileSync("out.c", code, {encoding: "utf-8"});
    exec("gcc -o output out.c -O3", () => {
        //fs.unlinkSync("out.c");
    });
}