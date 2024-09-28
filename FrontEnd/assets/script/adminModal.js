import { repWorks } from "./config.js";

const modalAdmin = document.querySelector(".modalAdmin");
const modalGallery = document.querySelector(".modalGallery");

export function closeModal() {
    modalAdmin.style.visibility = "hidden";
}

export function openModal() {
    modalAdmin.style.visibility = "visible";
    firstModal();
}

export function firstModal() {
    modalGallery.innerHTML = "";
    for (let i = 0; i < repWorks.length; i++) {
        const projet = repWorks[i];

        const projetElement = document.createElement("figure");
        const projetImage = document.createElement("img");
        const trashBtn = document.createElement("span");
        trashBtn.innerHTML = "<i class=\"fa-solid fa-trash-can\"><\/i>"
        trashBtn.classList.add("trash");

        projetImage.src = projet.imageUrl;
        projetImage.alt = projet.title;
        projetImage.id = projet.id;

        projetElement.appendChild(trashBtn);
        projetElement.appendChild(projetImage);
        modalGallery.appendChild(projetElement);
    }
}


