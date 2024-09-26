import { api, works, categories, repWorks, repCateg } from "./config.js";

export function genWorks(repWorks) {
    const sectionProjets = document.querySelector(".gallery");
    for (let i = 0; i < repWorks.length; i++) {
        const projet = repWorks[i];

        const projetElement = document.createElement("figure");
        const projetImage = document.createElement("img");
        const projetName = document.createElement("figcaption");

        projetImage.src = projet.imageUrl;
        projetImage.alt = projet.title;
        projetName.innerText = projet.title;

        projetElement.appendChild(projetImage);
        projetElement.appendChild(projetName);
        sectionProjets.appendChild(projetElement);
    }
}
