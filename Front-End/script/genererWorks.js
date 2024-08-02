export function genererWorks(works) {
    const sectionProjets = document.querySelector(".gallery");
    if (!sectionProjets) {
        console.error("L'élément '.gallery' est introuvable.");
        return;
    }

    sectionProjets.innerHTML = ""; // Réinitialiser le contenu de la galerie

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

export function filterCreate(categorie, works) {
    const filter = document.querySelector(".filter");
    if (!filter) {
        console.error("L'élément '.filter' est introuvable.");
        return;
    }

    const buttons = [
        { text: "Tous", action: () => genererWorks(works) },
        ...categorie.map(cat => ({
            text: cat.name,
            action: () => genererWorks(works.filter(work => work.category.name === cat.name))
        }))
    ];

    buttons.forEach(({ text, action }) => {
        const button = document.createElement("button");
        button.innerText = text;
        filter.appendChild(button);
        button.addEventListener("click", action);
    });
}

export function genererWorksModal(works) {
    const imageContent = document.querySelector(".modal-content");
    if (!imageContent) {
        console.error("L'élément '.modal-content' est introuvable.");
        return;
    }

    imageContent.innerHTML = ""; // Réinitialiser le contenu de la modal

    for (let i = 0; i < works.length; i++) {
        const projet = works[i];
        const div = document.createElement("div");
        const image = document.createElement("img");
        const delet = document.createElement("span");

        delet.className = "delet";
        delet.id = projet.id;
        delet.innerHTML = "<i class='fa-solid fa-trash-can'></i>";

        image.src = projet.imageUrl;

        div.appendChild(image);
        div.appendChild(delet);
        imageContent.appendChild(div);
    }
}