const symbolTableEmpty = {};
const eachBlockPre = (tree, action, args) => {
    action(tree, args);
    if (tree.functions != undefined) {
        tree.functions.forEach((fun) => eachBlockPre(fun, action, args));
    }
};
let addValSymbolTable = (symbolTable, val, type) => {
    if (val instanceof Array) {
        if (symbolTable[val[0]])
            console.log(type + " definition " + val[0] + " duplicated");
        symbolTable[val[0]] = val[1];
    } else {
        if (symbolTable[val])
            console.log(type + " definition " + val + " duplicated");
        symbolTable[val] = type;
    }
};

let createSymbolTable = (tree, symbolTable) => {

    tree.symbolTable = {
        father: symbolTable
    };
    if (tree.type == "FUNCTION") {
        tree.symbolTable.name = tree.name.value;
        tree.block.variables.forEach((val) => addValSymbolTable(tree.symbolTable, val, "variable"));
        tree.block.constants.forEach((val) => addValSymbolTable(tree.symbolTable, val, "constant"));
        tree.block.functions.forEach((val) => addValSymbolTable(tree.symbolTable, val.name.value, "function"));

    }
    if (tree.type == "BLOCK") {
        tree.variables.forEach((val) => addValSymbolTable(tree.symbolTable, val, "variable"));
        tree.constants.forEach((val) => addValSymbolTable(tree.symbolTable, val, "constant"));
        tree.functions.forEach((val) => addValSymbolTable(tree.symbolTable, val.name.value, "function"));
    }
};

let checkSymboltable = (tree, symbolTable) => {

    if (tree.type == "FUNCTION") {
        tree.block.variables.forEach((val) => checkSymbol(tree.symbolTable, val, "variable"));
        tree.block.constants.forEach((val) => checkSymbol(tree.symbolTable, val, "constant"));
        tree.block.functions.forEach((val) => checkSymbol(tree.symbolTable, val.name.value, "function"));

    }
    if (tree.type == "BLOCK") {
        tree.variables.forEach((val) => checkSymbol(tree.symbolTable, val, "variable"));
        tree.constants.forEach((val) => checkSymbol(tree.symbolTable, val, "constant"));
        tree.functions.forEach((val) => checkSymbol(tree.symbolTable, val.name.value, "function"));
    }
};

let checkSymbol = (symbolTable, val, type) => {
    
    if(symbolTable.father[val[0]] != undefined){
        console.log("Elemento duplicado");
        symbolTable[val[0]] = "Duplicado"
    }
};

function semantic(tree) {
    eachBlockPre(tree, createSymbolTable, symbolTableEmpty);
    eachBlockPre(tree, createSymbolTable, tree.symbolTable);

    tree["symbolTable"].father = {};
    eachBlockPre(tree, checkSymboltable, tree.symbolTable);

}
