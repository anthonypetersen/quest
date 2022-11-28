import { generate } from "./js/quest.js";

async function quest() {
    
    var ta = document.getElementById("ta");

    ta.onkeyup = (event) => {
        
        generate(ta.value, "rendering", {});

        /*
        transform.tout((previousResults) => {
            transform.parse(
                {
                    text: ta.value,
                },
                "rendering",
                previousResults
            ); 
        });
        */
    }

}

//let prevResults = localforage.getItem("previousResults") ? localforage.getItem("previousResults") : {};

/*
transform.tout = function (fun, tt = 500) {
    if (transform.tout.t) {
      clearTimeout(transform.tout.t);
    }
    transform.tout.t = setTimeout(fun(prevResults), tt);
};
*/

window.onload = quest();