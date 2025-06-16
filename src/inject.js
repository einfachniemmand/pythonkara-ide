function convertToWritable (input) {
    var lines = input.split("\n");
    var output = "";
    lines.forEach((cm,line)=>{
        if(!cm.startsWith("debug;")){
            output+= `<div class='cm-line'><span class='cm'>${cm}</span></div>`
        }else{
            output+= `<div class='cm-line'><span class='cm'>print("<span style='color:orange'>Breakpoint at line ${line+1}</span>")</span></div>`
            document.querySelector(".cm-breakpoint-gutter").dispatchEvent(new MouseEvent("mousedown",{bubbles:true,clientX:0,clientY:55+(16.9*(line-1)),button:0}))
        }
    })
    return output
}
setInterval(()=>{
    document.querySelector(".cm-content").innerHTML = localStorage.getItem('pykara_script') ?  convertToWritable(localStorage.getItem('pykara_script')) : "";
    document.querySelector("main > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)").max = 10.5;
},300)
