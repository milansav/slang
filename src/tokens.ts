export const isLet = (test: string): boolean => {
    return test === "let";
};

export const isBe = (test: string): boolean => {
    return test === "be";
};

export const isAs = (test: string): boolean => {
    return test === "as";
};

export const isString = (test: string): boolean => {
    return test === "'";
};

export const isIn = (test: string): boolean => {
    return test === "in";
};

export const isEach = (test: string): boolean => {
    return test === "each";
};

export const isDotEach = (test: string): boolean => {
    return test === ".each";
};

export const isMap = (test: string): boolean => {
    return test === "map";
};

export const isDotMap = (test: string): boolean => {
    return test === ".map";
};

export const isFor = (test: string): boolean => {
    return test === "for";
};

export const isDotFor = (test: string): boolean => {
    return test === ".for";
};

export const isTimes = (test: string): boolean => {
    return test === "times";
};

export const isMake = (test: string): boolean => {
    return test === "make";
};

export const isIf = (test: string): boolean => {
    return test === "if";
};

export const isElse = (test: string): boolean => {
    return test === "else";
};

export const isElseIf = (test: string): boolean => {
    return test === "elif";
};

export const isFunction = (test: string): boolean => {
    return test === "func";
};

export const isDotFunction = (test: string): boolean => {
    return test === ".func";
};

export const isExtern = (test: string): boolean => {
    return test === "extern";
};

export const isDotIf = (test: string): boolean => {
    return test === ".if";
};

export const isArrayB = (test: string): boolean => {
    return test === "(";
};

export const isArrayE = (test: string): boolean => {
    return test === ")";
};

export const isNum = (test: string): boolean => {
    return test[0] >= '0' && test[0] <= '9';
};

export const isIdent = (test: string): boolean => {
    return (test[0] === '_') || (test[0] === '-') || (test[0] >= 'a' && test[0] <= 'z') || (test[0] >= 'A' && test[0] <= 'Z');
};

export const isInitialize = (test: string): boolean => {
    return test === ":=";
};

export const isOperator = (test: string): boolean => {
    return test === "=";
};

export const isBinOp = (test: string): boolean => {
    return test === "+" || test === "-" || test === "*" || test === "/" || test === "%";
};

export const isBoolOp = (test: string): boolean => {
    return test === "==" || test === ">=" || test === "<=" || test === "!=" || test === ">" || test === "<";
};

export const isBeginArray = (test: string): boolean => {
    return test === "(";
};

export const isEndArray = (test: string): boolean => {
    return test === ")";
};

export const isBeginBody = (test: string): boolean => {
    return test === "{";
};

export const isEndBody = (test: string): boolean => {
    return test === "}";
};