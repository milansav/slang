import {readFile, readFileSync} from "fs";
import * as tk from "./tokens";
import {addImport, addLine, buildCode, compile, containsImport} from "./CTranspiler";
import {createNewStack, getVariable, Memory, removeStack, removeVariable, Stack, variableExists} from "./memory";

interface ConsoleArguments {
    files: {
        name: string,
    }[]
}

let currentStack: Stack;
let newMemory: Memory = {
    stack: []
};
newMemory.stack.push({variables: []});
currentStack = newMemory.stack[0];

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

let sourceCode = readFileSync(process.argv[2], {encoding: "utf-8"});

function tokenize(input: string) {
    let tokens: string[] = input.split(/\n|\s/);
    return tokens;
}

let tokens: string[] = tokenize(sourceCode);
let x = 0;
let c = tokens[x];
let n = tokens[x + 1];
const next = () => {
    x++;
    c = tokens[x];
    n = tokens[x + 1];
};

function parse() {

    const parseStatement = () => {
        //console.log("Parse Statement");
        console.log(newMemory, currentStack);
        console.log(c);
        if (tk.isLet(c)) {
            parseLet();
            return;
        } else if (tk.isEach(c)) {
            parseEach();
            return;
        } else if (tk.isMake(c)) {
            parseMake();
            return;
        } else if (tk.isMap(c)) {
            parseMap();
            return;
        } else if (tk.isIf(c)) {
            parseIf();
            return;
        } else if (tk.isFor(c)) {
            parseFor();
            return;
        } else if (tk.isIdent(c)) {
            parseIdent();
            return;
        } else {
            throw new Error("Unexpected token: " + c);
        }
    };

    const parseIdent = () => {

        if (variableExists(newMemory, c)) {
            console.log("variable");

            let letName = c;
            if (getVariable(newMemory, letName)?.type === "reference")
                letName = `*${letName}`;

            next();

            if (tk.isOperator(c)) {
                let operator = "";
                let firstNum = "";
                let secondNum = "";

                next();

                //Left side
                if (tk.isIdent(c)) {
                    if (variableExists(newMemory, c)) {
                        firstNum = c;
                        if (getVariable(newMemory, firstNum)?.type === "reference")
                            firstNum = `*${firstNum}`;
                        next();
                    }
                } else if (tk.isNum(c)) {
                    firstNum = c;
                    next();
                } else {
                    throw new Error("Unexpected token: " + c);
                }

                if (tk.isBinOp(c)) {
                    operator = c;
                    next();

                    //Right side
                    if (tk.isIdent(c)) {
                        if (variableExists(newMemory, c)) {
                            secondNum = c;
                            if (getVariable(newMemory, secondNum)?.type === "reference")
                                secondNum = `*${secondNum}`;
                            next();
                        }
                    } else if (tk.isNum(c)) {
                        secondNum = c;
                        next();
                    } else {
                        throw new Error("Unexpected token: " + c);
                    }

                    addLine(`${letName} = ${firstNum} ${operator} ${secondNum};`);
                } else {
                    addLine(`${letName} = ${firstNum};`);
                }

            } else {
                throw new Error("Unexpected token: " + c);
            }

            return;
        } else if (c === "print") {
            if (!containsImport("stdio"))
                addImport("stdio");
            next();

            console.log("Print: " + c);

            let letName = c;

            let variable = getVariable(newMemory, letName);

            if (!variable)
                throw new Error("Variable doesn't exist: " + letName);

            if (variable.type === "number") {
                addLine(`printf("%d", ${letName});`);
            } else if (variable.type === "number[]") {

                let iteratorName = "x";
                while (variableExists(newMemory, iteratorName)) {
                    iteratorName += randomNumber(0, 9);
                }
                // @ts-ignore
                currentStack = createNewStack(newMemory);
                // @ts-ignore
                currentStack.variables[iteratorName] = {type: "number", value: 0};

                addLine(`for(int ${iteratorName} = 0; ${iteratorName} < ${letName}_size; ${iteratorName}++) {`);
                addLine(`printf("%d", ${letName}[${iteratorName}]);`);
                addLine(`}`);

                currentStack = removeStack(newMemory);

            } else if (variable.type === "reference") {
                addLine(`printf("%d", *${letName});`);
            } else if(variable.type === "string") {
                addLine(`printf("%s", ${letName});`);
            }
        } else if (c === "println") {
            if (!containsImport("stdio"))
                addImport("stdio");
            next();

            console.log("Print: " + c);

            let letName = c;

            let variable = getVariable(newMemory, letName);

            if (!variable)
                throw new Error("Variable doesn't exist: " + letName);

            if (variable.type === "number") {
                addLine(`printf("%d\\n", ${letName});`);
            } else if (variable.type === "number[]") {

                let iteratorName = "x";
                while (variableExists(newMemory, iteratorName)) {
                    iteratorName += randomNumber(0, 9);
                }
                // @ts-ignore
                currentStack = createNewStack(newMemory);
                // @ts-ignore
                currentStack.variables[iteratorName] = {type: "number", value: 0};

                addLine(`for(int ${iteratorName} = 0; ${iteratorName} < ${letName}_size; ${iteratorName}++) {`);
                addLine(`printf("%d\\n", ${letName}[${iteratorName}]);`);
                addLine(`}`);

                currentStack = removeStack(newMemory);

            } else if (variable.type === "reference") {
                addLine(`printf("%d\\n", *${letName});`);
            } else if(variable.type === "string") {
                addLine(`printf("%s\\n", ${letName});`);
            }
        }

        next();
    };

    const parseLet = () => {
        //console.log("Parse Let");
        next();

        let letName = "";

        if (tk.isIdent(c)) {
            //console.log("Name: " + c);
            letName = c;
        } else {
            throw new Error("Unexpected token: " + c);
        }

        next();

        if (tk.isBe(c)) {
            //console.log("Is Be");
            next();

            if (tk.isNum(c)) {
                //console.log("Is Num: " + c);
                // @ts-ignore
                currentStack.variables[letName] = {type: "number", value: parseInt(c)};
                // @ts-ignore
                addLine(`int ${letName} = ${c};`);
                //Nothing else to do, continue
                next();
            } else if (tk.isString(c)) {
                console.log("Itsa me string");
                next();

                let tempArr = [];
                let temp = "";

                while (!tk.isString(c)) {
                    tempArr.push(c);
                    console.log(`Word: ${c}`);
                    next();
                }

                temp = tempArr.join(" ");

                if (tk.isString(c)) {
                    // @ts-ignore
                    currentStack.variables[letName] = {type: "string", value: temp};
                    if (!containsImport("stdlib"))
                        addImport("stdlib");

                    addLine(`unsigned long long ${letName}_size = ${temp.length};`);
                    addLine(`char* ${letName} = malloc(${letName}_size);`);
                    //addLine(`${letName}[${letName}_size-1] = "\\0";`);
                    addLine(`${letName} = "${temp}";`);

                    next();
                }
            } else if (tk.isArrayB(c)) {
                //console.log("Is Array");
                next();
                let temp_mem = [];
                while (tk.isNum(c)) {
                    //console.log("Num: " + c);
                    temp_mem.push(parseInt(c));
                    next();
                }

                if (tk.isArrayE(c)) {
                    //console.log("Is Array End");

                    //Nothing else to do continue
                    next();
                }

                // @ts-ignore
                currentStack.variables[letName] = {type: "number[]", value: temp_mem};
                if (!containsImport("stdlib"))
                    addImport("stdlib");

                addLine(`unsigned long long ${letName}_size = ${temp_mem.length};`);
                addLine(`int* ${letName} = malloc(sizeof(int) * ${letName}_size);`);
                addLine(`${letName} = (int[]){${temp_mem.join(',')}};`)
            }
        } else {
            throw new Error("Unexpected token: " + c);
        }
    };

    const parseEach = () => {
        //console.log("Parse Each");
        next();

        let targetName = "";
        let letName = "";

        if (tk.isIdent(c)) {
            //console.log("Name: " + c);
            targetName = c;
            next();

            if (tk.isAs(c)) {
                //console.log("Is As");

                next();

                if (tk.isIdent(c)) {
                    //console.log("Name: " + c);
                    letName = c;
                }

                let iteratorName = "x";
                while (variableExists(newMemory, iteratorName)) {
                    iteratorName += randomNumber(0, 9);
                }

                addLine(`for(int ${iteratorName} = 0; ${iteratorName} < ${targetName}_size; ${iteratorName}++)`);
                addLine("{");
                currentStack = createNewStack(newMemory);
                // @ts-ignore
                currentStack.variables[iteratorName] = {type: "number", value: 0};
                // @ts-ignore
                currentStack.variables[letName] = {type: "number", value: 0};
                addLine(`int ${letName} = ${targetName}[${iteratorName}];`);

                next();
                do {
                    parseStatement();
                } while (!tk.isDotEach(c));

                if (tk.isDotEach(c)) {
                    //console.log("Is dot each");

                    currentStack = removeStack(newMemory);

                    addLine("}");
                    //finish each loop and continue
                    next();
                }

            }
        }
    };

    const parseFor = () => {
        //console.log("Parse Each");
        next();

        let letName = "";

        if (tk.isIdent(c)) {
            if (variableExists(newMemory, c)) throw new Error("Variable already exists!");

            letName = c;

            console.log(letName);

            next();

            if (tk.isIn(c)) {
                next();
            }

        }

        if (c === "times") {
            next();
            let times = c;

            let iteratorName = "";

            if (letName === "") {
                iteratorName = "x";
                while (variableExists(newMemory, iteratorName)) {
                    iteratorName += randomNumber(0, 9);
                }
            }

            iteratorName = letName;

            addLine(`for(int ${iteratorName} = 0; ${iteratorName} < ${times}; ${iteratorName}++)`);
            addLine("{");
            currentStack = createNewStack(newMemory);
            // @ts-ignore
            currentStack.variables[iteratorName] = {type: "number", value: 0};
            // @ts-ignore

            next();
            do {
                parseStatement();
            } while (!tk.isDotFor(c));

            if (tk.isDotFor(c)) {
                //console.log("Is dot each");

                currentStack = removeStack(newMemory);

                addLine("}");
                //finish each loop and continue
                next();
            }
        }
    };

    const parseMap = () => {
        //console.log("Parse Each");
        next();

        let targetName = "";
        let letName = "";

        if (tk.isIdent(c)) {
            //console.log("Name: " + c);
            targetName = c;
            next();

            if (tk.isAs(c)) {
                //console.log("Is As");

                next();

                if (tk.isIdent(c)) {
                    //console.log("Name: " + c);
                    letName = c;
                }

                let iteratorName = "x";
                while (variableExists(newMemory, iteratorName)) {
                    iteratorName += randomNumber(0, 9);
                }

                addLine(`for(int ${iteratorName} = 0; ${iteratorName} < ${targetName}_size; ${iteratorName}++)`);
                addLine("{");
                addLine(`int* ${letName} = ${targetName}+${iteratorName};`);

                currentStack = createNewStack(newMemory);
                // @ts-ignore
                currentStack.variables[iteratorName] = {type: "number", value: 0};
                // @ts-ignore
                currentStack.variables[letName] = {type: "reference", value: 0};

                next();
                do {
                    console.log("Parsing statement");
                    parseStatement();
                } while (!tk.isDotMap(c));

                if (tk.isDotMap(c)) {
                    //console.log("Is dot each");

                    currentStack = removeStack(newMemory);

                    addLine("}");
                    //finish each loop and continue
                    next();
                }
            }
        }
    };

    const parseMake = () => {
        //console.log("Parse Make");
        next();

        let letName = "";
        if (tk.isIdent(c)) {
            letName = c;
            next();

            if (tk.isBe(c)) {
                next();

                if (tk.isNum(c)) {
                    variableExists(newMemory, letName);
                    // @ts-ignore
                    currentStack.variables[letName] = parseInt(c);
                    addLine(`${letName} = ${c};`);
                } else if (tk.isArrayB(c)) {
                    next();
                    let temp_mem = [];
                    while (tk.isNum(c)) {
                        //console.log("Num: " + c);
                        temp_mem.push(parseInt(c));
                        next();
                    }

                    if (tk.isArrayE(c)) {
                        //console.log("Is Array End");

                        //Nothing else to do continue
                        next();
                    }

                    // @ts-ignore
                    memory[letName] = temp_mem;
                } else {
                    throw new Error("Unexpected token: " + c);
                }
            } else {
                throw new Error("Unexpected token: " + c);
            }
        } else {
            throw new Error("Unexpected token: " + c);
        }
    };

    const parseIf = () => {
        next();

        let first = "";
        let second = "";
        let operator = "";

        if (tk.isIdent(c)) {
            if (variableExists(newMemory, c)) {
                first = c;
                if (getVariable(newMemory, first)?.type === "reference")
                    first = `*${first}`;
                next();
            }
        } else if (tk.isNum(c)) {
            first = c;
            next();
        } else {
            throw new Error("Unexpected token: " + c);
        }

        if (tk.isBoolOp(c)) {
            operator = c;
            next();
        }

        if (tk.isIdent(c)) {
            if (variableExists(newMemory, c)) {
                second = c;
                if (getVariable(newMemory, second)?.type === "reference")
                    second = `*${second}`;
                next();
            }
        } else if (tk.isNum(c)) {
            second = c;
            next();
        } else {
            throw new Error("Unexpected token: " + c);
        }

        addLine(`if (${first} ${operator} ${second})`);
        addLine("{");

        currentStack = createNewStack(newMemory);

        do {
            parseStatement();
        } while (!tk.isDotIf(c));

        if (tk.isDotIf(c)) {
            console.log("Is dot if");

            currentStack = removeStack(newMemory);

            addLine("}");
            next();
        }

    };

    while (tokens[x]) {
        parseStatement();
    }

    removeStack(newMemory);

    let code = buildCode();
    compile(code).then(() => console.log("Finished compiling"));
}

parse();
