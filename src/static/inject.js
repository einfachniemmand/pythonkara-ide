function convertToWritable (input) {
    var lines = input.split("\n");
    var output = "";
    lines.forEach(cm=>{
        output+= `<div class='cm-line'><span class='cm'>${cm}</span></div>\n`
    })
    return output
}
setInterval(()=>{
    document.querySelector(".cm-content").innerHTML = localStorage.getItem('pykara_script') ?  convertToWritable(localStorage.getItem('pykara_script')) : ""; 
},300)