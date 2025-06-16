function downloadContent () {
    const blob = new Blob([getEditorValue()], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = document.querySelector(".file-name").value.trim().length>0?document.querySelector(".file-name").value.trim():"kara.py";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
function loadDocs () {
    document.querySelector(".documentation").style.display = "flex";
    setTimeout(()=>{
        document.querySelector(".documentation").style.opacity = "1"
        document.querySelector(".documentation").style.paddingTop = "0"
    },150)
}
function closeDocs () {
    document.querySelector(".documentation").style.opacity = ""
    document.querySelector(".documentation").style.paddingTop = ""
    setTimeout(()=>{
        document.querySelector(".documentation").style.display = "";
    },250)
}
function openGenerator () {
    document.querySelector(".generative-outer").style.display = "flex";
    setTimeout(()=>{
        document.querySelector(".generative-outer").style.opacity = "1"
        document.querySelector(".generative-outer").style.paddingTop = "0"
    },150)
}
function closeGenerator () {
    document.querySelector(".generative-outer").style.opacity = ""
    document.querySelector(".generative-outer").style.paddingTop = ""
    setTimeout(()=>{
        document.querySelector(".generative-outer").style.display = "";
    },250)
}
function generateIdea () {
    document.querySelector(".generative-outer b").style.opacity = "0"
    const input = document.getElementById("bi").value.trim();
    if(input.length<8||input.length>128){
        document.querySelector(".generative-outer b").style.opacity = "1"
        return
    }
    closeGenerator();
    var prefix = "You are the coding agent in a website that generates PythonKara Code. Generate code for the following prompt: '";
    var suffix = "' Respond with the python script only, no need for `def main` or any imports. Kara-Commands: "+karaFunctions.map(f => f.insertText).join("; ") + "; Progress of the User: " + getEditorValue();
    setEditorValue("# Generating your script...")
    fetch ("https://hakuna-matata.einfachniemmand-project.workers.dev/website/", {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            content: prefix+input+suffix
        })
    }).then(response=>response.json())
    .then(response => {
        let text = response.candidates[0].content.parts[0].text.replaceAll("```python","").replaceAll("´","").replaceAll("`","").trim();
        setEditorValue(text);
    })
    .catch(error=>{
        setEditorValue("")
        document.querySelector(".generative-outer b").style.opacity = "1"
        openGenerator()
        console.error(error.message); 
    })
}