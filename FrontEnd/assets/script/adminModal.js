import { repWorks } from "./config.js";
import { genWorks } from "./genWorks.js";

const modalAdmin = document.querySelector(".modalAdmin");
const modalGallery = document.querySelector(".modalGallery");

export function closeModal() {
    modalAdmin.style.visibility = "hidden";
}

export function openModal() {
    modalAdmin.style.visibility = "visible";
    firstModal(repWorks);
}


export function firstModal(repWorks) {

    modalGallery.innerHTML = "";

    for (let i = 0; i < repWorks.length; i++) {
        const projet = repWorks[i];

        const projetElement = document.createElement("figure");
        const projetImage = document.createElement("img");
        const trashBtn = document.createElement("i");

        trashBtn.classList = "fa-solid fa-trash-can trash"
        projetImage.src = projet.imageUrl;
        projetImage.alt = projet.title;
        trashBtn.id = projet.id;

        projetElement.appendChild(trashBtn);
        projetElement.appendChild(projetImage);
        modalGallery.appendChild(projetElement);
    }
}

export function deletWorks(event) {
    event.preventDefault();

    if (sessionStorage.getItem("token") != null) {
        const token = sessionStorage.getItem("token");
        const workId = event.target.id;

        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` },
        })
            .then(response => {
                if (response.ok) {
                    console.log("Travail supprimé avec succès.");
                    return fetch("http://localhost:5678/api/works");
                } else {
                    console.log("Erreur : " + response.status);
                    throw new Error("Erreur de suppression");
                }
            })
            .then(response => response.json())
            .then(data => {
                firstModal(data);
                genWorks(data);
            })
            .catch(error => {
                console.log("Erreur de connexion : ", error);
            });
    }
}
