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

export function genererWorksModal(works) {
    for (var i = 0; i < works.length; i++) {
        const projets = works[i];
        const imageContent = document.querySelector(".modal-content");
        const div = document.createElement("div")
        const image = document.createElement("img");
        const delet = document.createElement("span");
        delet.setAttribute("class", "delet");
        delet.setAttribute("id", projets.id)
        delet.innerHTML = "<i class='fa-solid fa-trash-can'></i>"
        image.src = projets.imageUrl;
        imageContent.appendChild(div);
        div.appendChild(image);
        div.appendChild(delet);
    }
}

