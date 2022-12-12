function changeStyle() {
    document.getElementById("pagestyle").setAttribute("href", './css/Custom.css');
}

async function getURL() {

    //let url = "https://raw.githubusercontent.com/episphere/questionnaire/main/module1Stage.txt";
    let url = "https://raw.githubusercontent.com/anthonypetersen/quest/simplify/testing.txt";
    //let url = "https://raw.githubusercontent.com/episphere/questionnaire/main/ssnModule.txt";
    ta.value = await (await fetch(url)).text();
    ta.onkeyup();
}