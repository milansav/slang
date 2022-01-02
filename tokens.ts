const isLet = (test: string): boolean => {
    return test === "let";
};

const isBe = (test: string): boolean => {
    return test === "be";
};

const isAs = (test: string): boolean => {
    return test === "as";
};

const isEach = (test: string): boolean => {
    return test === "each";
};

const isDotEach = (test: string): boolean => {
    return test === ".each";
};

const isMap = (test: string): boolean => {
    return test === "map";
};

const isDotMap = (test: string): boolean => {
    return test === ".map";
};

const isFor = (test: string): boolean => {
    return test === "for";
};

const isDotFor = (test: string): boolean => {
    return test === ".for";
};

const isTimes = (test: string): boolean => {
    return test === "times";
};

const isMake = (test: string): boolean => {
    return test === "make";
};

const isIf = (test: string): boolean => {
    return test === "if";
};

const isElse = (test: string): boolean => {
    return test === "else";
};

const isElseIf = (test: string): boolean => {
    return test === "elif";
};

const isDotIf = (test: string): boolean => {
    return test === ".if";
};

const isArrayB = (test: string): boolean => {
    return test === "(";
};

const isArrayE = (test: string): boolean => {
    return test === ")";
};

const isNum = (test: string): boolean => {
    return test[0] >= '0' && test[0] <= '9';
};

const isIdent = (test: string): boolean => {
    return (test[0] === '_') || (test[0] === '-') || (test[0] >= 'a' && test[0] <= 'z') || (test[0] >= 'A' && test[0] <= 'Z');
};

const isOperator = (test: string): boolean => {
    return test === "=";
};

const isBinOp = (test: string): boolean => {
    return test === "+" || test === "-" || test === "*" || test === "/";
};

const isBoolOp = (test: string): boolean => {
    return test === "==" || test === ">=" || test === "<=" || test === "!=" || test === ">" || test === "<";
};

export {isLet, isBe, isAs, isEach, isDotEach, isMap, isDotMap, isFor, isDotFor, isTimes, isMake, isIf, isElse, isElseIf, isDotIf, isArrayB, isArrayE, isNum, isIdent, isOperator, isBinOp, isBoolOp};