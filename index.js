import { transform } from "./replace2.js";
import { questionQueue, moduleParams } from "./questionnaire.js";

let prevRes = {};

async function quest() {
    /*
    var ta = document.getElementById("ta");
    ta.onkeyup = (ev) => {
      transform.tout((previousResults) => {
        transform.render(
          {
            text: ta.value,
          },
          "rendering",
          previousResults
        ); // <-- this is where quest.js is engaged
        // transform.render({url: 'https://jonasalmeida.github.io/privatequest/demo2.txt&run'}, 'rendering') // <-- this is where quest.js is engaged
        if (document.querySelector(".question") != null) {
          document.querySelector(".question").classList.add("active");
        }
      });
      */
}

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
    //prevRes = JSON.parse(json_input.value);
}

function clearMemory() {
    
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

    prevRes = {};
}

/*

transform.tout = function (fun, tt = 500) {
    if (transform.tout.t) {
      clearTimeout(transform.tout.t);
    }
    transform.tout.t = setTimeout(fun(prevRes), tt);
  };
*/

window.onload = quest();