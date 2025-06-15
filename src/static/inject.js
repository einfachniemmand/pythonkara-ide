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
    document.querySelector("main > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)").max = 10.5;
},300)
