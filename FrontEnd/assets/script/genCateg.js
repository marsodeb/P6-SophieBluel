import { repCateg } from "./config.js";

/////////////////////////////////////////////////////
// CRÉATION DYNAMIQUE DES BOUTONS CATEGORIES    /////
/////////////////////////////////////////////////////

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


