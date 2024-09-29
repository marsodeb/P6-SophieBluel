import { repWorks, repCateg } from "./config.js";
import { genWorks } from "./genWorks.js"

export function genCateg() {

    const sectionCateg = document.querySelector(".categ")

    if (!sectionCateg) {
        return;
    } else {
        const allButton = document.createElement("button");
        allButton.classList = "buttonCateg selectedCateg";
        allButton.id = "0";
        allButton.innerText = "Tous";
        sectionCateg.appendChild(allButton);

        for (let i = 0; i < repCateg.length; i++) {

            const categ = repCateg[i];

            const categButton = document.createElement("button");

            categButton.classList = "buttonCateg";
            categButton.id = categ.id;
            categButton.innerText = categ.name;

            sectionCateg.appendChild(categButton);
        }
    }
}

export function filterWorks(e) {
    const sectionProjets = document.querySelector(".gallery")
    sectionProjets.innerHTML = "";

    const buttons = document.querySelectorAll(".buttonCateg");

    buttons.forEach(button => {
        button.classList.remove("selectedCateg");
    });

    e.target.classList.add("selectedCateg");

    if (e.target.id != 0) {
        genWorks(repWorks.filter(work => work.category.name === e.target.innerText));
    }
    else {
        genWorks(repWorks);
    }
}

