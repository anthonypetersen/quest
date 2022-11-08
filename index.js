function changeLogic() {
    
    if(document.getElementById("logic").checked) {
        document.getElementById("pagelogic").setAttribute("href", 'ActiveLogic.css');
    }
    else {
        document.getElementById("pagelogic").setAttribute("href", 'Default.css');
    }
}

function changeStyle() {
    document.getElementById("pagestyle").setAttribute("href", sheet)
}