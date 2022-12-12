function changeStyle() {
    if(document.getElementById("styling").checked) {
        document.getElementById("pagestyle").setAttribute("href", 'Style1.css');
    }
    else {
        document.getElementById("pagestyle").setAttribute("href", 'Default.css');
    }
}

async function getURL() {

    //let url = "https://raw.githubusercontent.com/episphere/questionnaire/main/module1Stage.txt";
    let url = "https://raw.githubusercontent.com/anthonypetersen/quest/simplify/testing.txt";
    //let url = "https://raw.githubusercontent.com/episphere/questionnaire/main/ssnModule.txt";
    ta.value = await (await fetch(url)).text();
    ta.onkeyup();
}