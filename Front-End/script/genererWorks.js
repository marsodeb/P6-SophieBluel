export function genererWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const projets = works[i];
        const sectionProjets = document.querySelector(".gallery");
        const projetsElement = document.createElement("figure");
        const projetsImage = document.createElement("img");
        projetsImage.src = projets.imageUrl;
        projetsImage.alt = projets.title;
        const projetsName = document.createElement("figcaption");
        projetsName.innerText = projets.title;

        sectionProjets.appendChild(projetsElement);
        projetsElement.appendChild(projetsImage);
        projetsElement.appendChild(projetsName);

    }
}