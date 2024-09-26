import { api, works, categories, repWorks, repCateg } from "./config.js";
import { genWorks } from "./genWorks.js";
import { filterWorks, genCateg } from "./genCateg.js";

genWorks(repWorks);
genCateg();

const categButton = document.querySelectorAll(".categ button");

for (let i = 0; i < categButton.length; i++) {
    categButton[i].addEventListener("click", filterWorks)
}








