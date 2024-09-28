import { repWorks } from "./config.js";
import { genWorks } from "./genWorks.js";
import { filterWorks, genCateg } from "./genCateg.js";

genWorks(repWorks);
genCateg();

const categButton = document.querySelectorAll(".categ button");

for (let i = 0; i < categButton.length; i++) {
    categButton[i].addEventListener("click", filterWorks)
}

function checkAdmin() {
    if (sessionStorage.getItem("token") != null) {
        const logBtn = document.querySelector(".login");
        logBtn.innerHTML = "<a href='./pages/login.html'>logout</a>";
        logBtn.addEventListener("click", () => { sessionStorage.removeItem("token") })
        const adminModeVisible = document.querySelector(".adminMode");
        const adminEditVisible = document.querySelector(".adminEdit");
        adminModeVisible.style.visibility = "visible";
        adminModeVisible.style.maxHeight = "100%";
        adminEditVisible.style.visibility = "visible";
    } else {
    }
}

checkAdmin();


















