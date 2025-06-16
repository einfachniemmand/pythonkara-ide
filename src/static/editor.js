window.karaFunctions=[]
fetch("syntax.json")
.then(res=>res.json())
.then(res=>{
    window.karaFunctions = res;
})
.catch(error=>{
    console.error(error.message)
})
require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' }});
require(['vs/editor/editor.main'], function () {
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            const suggestions = karaFunctions.map(item => ({
                ...item,
                range,
                filterText: item.label
            }));
            return { suggestions };
        }
    });
    monaco.languages.setMonarchTokensProvider('python', {
        tokenizer: {
            root: [
                [/\b(kara|world|tools)\b(\s*\.)/, [
                    { token: 'custom-object' },
                    { token: '', next: '@kara_method' }
                ]],
                [/\b(debug)\b\s*;/, 'debug-statement'],
                [/\b(def|class|if|elif|else|while|for|in|try|except|finally|with|as|return|import|from|pass|break|continue|and|or|not|is|lambda|yield|assert|del|global|nonlocal|raise|True|False|None)\b/, 'keyword'],
                [/\b(print|len|range|str|int|float|list|dict|set|tuple|open|input|type|super|self)\b/, 'type.identifier'],
                [/[a-zA-Z_]\w*(?=\s*=)/, 'var-init'],
                [/[a-zA-Z_]\w*/, 'identifier'],
                { include: '@whitespace' },
                [/\d*\.\d+([eE][\-+]?\d+)?j?/, 'number.float'],
                [/\d+[eE][\-+]?\d+j?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+[lL]?/, 'number.hex'],
                [/0[bB][01]+[lL]?/, 'number.binary'],
                [/0[oO][0-7]+[lL]?/, 'number.octal'],
                [/\d+[lL]?/, 'number'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'/, 'string', '@string_single'],
                [/"/, 'string', '@string_double'],
            ],
            kara_method: [
                [/(move|turnLeft|turnRight|putLeaf|removeLeaf|onLeaf|treeFront|treeLeft|treeRight|mushroomFront|moveMushroom|setPosition|clearAll|setLeaf|setTree|setMushroom|setSize|isEmpty|isTree|isMushroom|isLeaf|getSizeX|getSizeY|println|showMessage|random|checkState|sleep|stringInput|intInput|doubleInput)/, 'custom-method', '@kara_paren'],
                [/[a-zA-Z_]\w*/, 'identifier', '@pop']
            ],
            kara_paren: [
                [/\(\)/, 'custom-method', '@popall'],
                ['', '', '@popall']
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/(^#.*$)/, 'comment'],
            ],
            string_single: [
                [/[^\\']+/, 'string'],
                [/\\./, 'string.escape'],
                [/'/, 'string', '@pop']
            ],
            string_double: [
                [/[^\\"]+/, 'string'],
                [/\\./, 'string.escape'],
                [/"/, 'string', '@pop']
            ]
        }
    });
    monaco.editor.defineTheme('kara-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'custom-object', foreground: '4EC9B0' },
            { token: 'custom-method', foreground: '00BFFF' },
            { token: 'var-init', foreground: '9CDCFE' },
            { token: 'debug-statement', foreground: 'FF0000' }
        ],
        colors: {}
    });
    monaco.editor.create(document.getElementById('textarea'), {
        value: localStorage.getItem("pykara_script") ? localStorage.getItem("pykara_script") : '# Happy coding :)\n# Bonus Tip: Use debug; for breakpoints \n# Learn more at ' + location.protocol + "//" + location.host + "/docs/",
        language: 'python',
        theme: 'kara-theme',
        automaticLayout: true
    });
});
window.getEditorValue = function() {
    const editors = monaco.editor.getEditors ? monaco.editor.getEditors() : [monaco.editor.getModels()[0]];
    const model = monaco.editor.getModels()[0];
    return model ? model.getValue() : '';
};
window.onload = function () {
    const editor = monaco.editor.getModels()[0];
    if (editor) {
        editor.onDidChangeContent(function () {
            exportContent();
        });
    }
    if(window.innerHeight<window.innerWidth){
        setTimeout(()=>{
            document.querySelector(".loading").style.opacity = "0";
            setTimeout(()=>{
                document.querySelector(".loading").style.display = "none";
            },140)
        },900)
    }else{
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".loading img").style.display = "none";
        document.querySelector(".loading span").textContent = "Not available for your device size"
    }
}
window.setEditorValue = function(value) {
    const model = monaco.editor.getModels()[0];
    if (model) {
        model.setValue(value);
    }
};
