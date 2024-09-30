/////////////////////////////////////////////////////
// CRÉATION DYNAMIQUE DU PORTFOLIO              /////
/////////////////////////////////////////////////////

export function genWorks(works) {

    const sectionProjets = document.querySelector(".gallery");

    sectionProjets.innerHTML = "";

    if (!sectionProjets) {
        return;
    } else {
        for (let i = 0; i < works.length; i++) {
            const projet = works[i];

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
}


