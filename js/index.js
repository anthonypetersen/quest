import { generate } from "./quest.js";

async function quest() {
    
    var ta = document.getElementById("ta");

    ta.onkeyup = (event) => {
        generate(ta.value, "rendering", {});
    }

    var styleButton = document.getElementById("changeStyle");

    styleButton.onclick = (event) => {
        document.getElementById("pagestyle").setAttribute("href", './css/Custom.css');
    }

    var urlButton = document.getElementById("uploadURL");

    urlButton.onclick = async (event) => {
        let url = "https://raw.githubusercontent.com/anthonypetersen/quest/simplify/testing.txt";
        ta.value = await (await fetch(url)).text();
        ta.onkeyup();
    }

}

window.onload = function () {
    quest();
};