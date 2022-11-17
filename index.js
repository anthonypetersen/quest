

function changeLogic() {
    if(document.getElementById("logic").checked) {
        document.getElementById("pagelogic").setAttribute("href", 'ActiveLogic.css');
    }
    else {
        document.getElementById("pagelogic").setAttribute("href", 'Default.css');
    }
}

function changeStyle() {
    if(document.getElementById("styling").checked) {
        document.getElementById("pagestyle").setAttribute("href", 'Style1.css');
    }
    else {
        document.getElementById("pagestyle").setAttribute("href", 'Default.css');
    }
}

function increaseSize() {
    let ta = document.getElementById("ta");
    let style = window.getComputedStyle(ta, null).getPropertyValue("font-size");
    let fontSize = parseFloat(style);
    ta.style.fontSize = fontSize + 1 + "px";
}
  
function decreaseSize() {
    let ta = document.getElementById("ta");
    let style = window.getComputedStyle(ta, null).getPropertyValue("font-size");
    let fontSize = parseFloat(style);
    ta.style.fontSize = fontSize - 1 + "px";
}

function addMemory() {
    let prevRes = JSON.parse(prev.value);
    localforage.setItem("previousResults", prevRes);
}

function clearMemory() {
    
    localforage.clear();
    /*
    localforage.clear().then(() => {
        loaddisplay.innerHTML = "local forage cleared";
    })
    .catch((err) => {
        loaddisplay.innerHTML = "caught error" + err;
        console.log("error while clearing lf.  ", err);
    });

    questionQueue.clear();

    */


}

async function getURL() {

    let url = "https://raw.githubusercontent.com/episphere/quest/main/questionnaires/demo.txt";
    ta.value = await (await fetch(url)).text();
    ta.onkeyup();
}