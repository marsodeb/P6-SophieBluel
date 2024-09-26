import { api, works, categories, repWorks, repCateg } from "./config.js";
import { genWorks } from "./genWorks.js"

export function genCateg() {

    const sectionCateg = document.querySelector(".categ")

    for (let i = 0; i < repCateg.length; i++) {


        const categ = repCateg[i];

        const categButton = document.createElement("button");

        categButton.id = categ.id;
        categButton.innerText = categ.name;

        sectionCateg.appendChild(categButton);

    }
}

export function filterWorks(e) {
    const sectionProjets = document.querySelector(".gallery");
    sectionProjets.innerHTML = "";

    if (e.target.id != 0) {
        genWorks(repWorks.filter(work => work.category.name === e.target.innerText))
    }
    else {
        genWorks(repWorks);
    }
}

