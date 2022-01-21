import {addImport, addLine, containsImport} from "./CTranspiler";

export interface Memory {
    stack: Stack[]
}

export interface Stack {
    variables: Variable[]
}

export interface Variable {
    name: string,
    type: string,
    value: any,
    userCreated: boolean
}

export function variableExists(memory: Memory, name: string): boolean {
    let hasFound = false;
    memory.stack.forEach(stack => {
        // @ts-ignore
        if(!stack.variables[name]) return;

        hasFound = true;
        return;
    });

    return hasFound;
}

export function getVariable(memory: Memory, name: string): Variable | null {
    let result: Variable | null = null;
    memory.stack.forEach(stack => {
        // @ts-ignore
        if(!stack.variables[name]) return;

        // @ts-ignore
        result = stack.variables[name];
        return;
    });

    return result;
}

export function removeVariable(variables: Variable[], name: string): Variable[] {
    let result: Variable[] = [];
    for(const key in variables){
        if(key !== name)
            result[key] = variables[key];
    }

    return result;
}

export function createNewStack(memory: Memory): Stack {
    memory.stack.push({variables: []});
    return memory.stack[memory.stack.length-1];
}

export function removeStack(memory: Memory): Stack {
    let stack = memory.stack[memory.stack.length-1];
    for (const key in stack.variables) {

        if(!containsImport("stdlib"))
            addImport("stdlib");

        if(stack.variables[key].type === "number[]") {
            addLine(`free(${key});`);
        }
    }

    memory.stack.pop();
    return memory.stack[memory.stack.length - 1];
}