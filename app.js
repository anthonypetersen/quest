import { transform } from "./render.js";

async function quest() {
    
    var ta = document.getElementById("ta");

    ta.onkeyup = (event) => {
        transform.tout((previousResults) => {
            transform.render(
                {
                    text: ta.value,
                },
                "rendering",
                previousResults
            ); 

            if (document.querySelector(".question") != null) {
                document.querySelector(".question").classList.add("active");
            }
            
        });
    }
}

let prevResults = localforage.getItem("previousResults") ? localforage.getItem("previousResults") : {};

transform.tout = function (fun, tt = 500) {
    if (transform.tout.t) {
      clearTimeout(transform.tout.t);
    }
    transform.tout.t = setTimeout(fun(prevResults), tt);
};


window.onload = quest();