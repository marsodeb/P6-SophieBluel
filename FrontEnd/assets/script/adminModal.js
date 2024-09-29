import { repWorks, repCateg } from "./config.js";
import { genWorks } from "./genWorks.js";
import { showPopup } from "./popUp.js";

const modalAdminFirst = document.querySelector(".Mfirst");
const modalAdminSecond = document.querySelector(".Msecond");
const modalGallery = document.querySelector(".modalGallery");

export function closeModal() {
    modalAdminFirst.style.visibility = "hidden";
    modalAdminSecond.style.visibility = "hidden";
}

export function openModal() {
    modalAdminFirst.style.visibility = "visible";
    firstModal(repWorks);
}

export function openSecondModal() {
    modalAdminFirst.style.visibility = "hidden";
    modalAdminSecond.style.visibility = "visible";
    secondModal();
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

function uploadCateg() {
    const uploadCategories = document.getElementById("uploadCateg");

    uploadCategories.innerHTML = "";

    for (let i = 0; i < repCateg.length; i++) {

        const categ = repCateg[i];

        const uploadCategOption = document.createElement("option");

        uploadCategOption.innerText = categ.name;

        uploadCategories.appendChild(uploadCategOption);
    }
}


export function secondModal() {

    const uploadFileContainer = document.querySelector(".uploadFile");

    uploadFileContainer.innerHTML = "";

    const imgUpload = document.createElement("img");
    const labelUpload = document.createElement("label");
    const spanUpload = document.createElement("span");
    const inputUpload = document.createElement("input");

    imgUpload.src = "./assets/images/upload.png";
    imgUpload.alt = "logo Upload";
    imgUpload.classList = "logoUpload";

    labelUpload.innerText = "+ Ajouter photo";
    labelUpload.classList = "labelUpload";
    labelUpload.setAttribute("for", "uploadFile");

    spanUpload.innerText = "jpg, png : 4mo max";
    spanUpload.classList = "infoUpload";

    inputUpload.setAttribute("type", "file");
    inputUpload.setAttribute("name", "imageUrl");
    inputUpload.id = "uploadFile";

    uploadFileContainer.append(imgUpload, labelUpload, spanUpload, inputUpload);

    uploadCateg();
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
                    showPopup("Travail supprimé avec succès.", false);
                    return fetch("http://localhost:5678/api/works");
                } else {
                    console.log("Erreur : " + response.status);
                }
            })
            .then(response => response.json())
            .then(data => {
                firstModal(data);
                genWorks(data);
            })
            .catch(error => {
                showPopup("Erreur réseau", true);
            });
    }
}

export function validateForm() {

    const uploadFile = document.querySelector("#uploadFile");
    const uploadTitle = document.querySelector("#uploadTitle");
    const uploadCateg = document.querySelector(".uploadCateg");

    const file = uploadFile.files[0];
    const title = uploadTitle.value;
    const category = uploadCateg.value;

    if (!file) {
        console.log("Aucun fichier sélectionné.");
        return false;
    }

    const fileSizeMB = file.size / (1024 * 1024); // Info google pour le calcul des tailles
    const fileType = file.type;

    if (fileType != "image/png" && fileType != "image/jpeg") {
        showPopup("Le fichier doit être un PNG ou JPG.", true);
        return false;
    }

    if (fileSizeMB > 4) {
        showPopup("Le fichier ne doit pas dépasser 4 Mo.", true);
        return false;
    }

    if (title === "") {
        return false;
    }

    if (category === "") {
        return false;
    }

    return true;
}

export function uploadWorks() {
    const form = document.querySelector(".uploadForm");

    // Récupère les valeurs du formulaire
    const uploadTitle = document.querySelector("#uploadTitle").value; // Titre
    const uploadCateg = document.querySelector("#uploadCateg").value; // Catégorie
    const uploadFile = document.querySelector("#uploadFile").files[0]; // Fichier

    // Crée un FormData pour envoyer les données
    const formData = new FormData();
    formData.append("imageUrl", uploadFile); // Ajoute le fichier
    formData.append("title", uploadTitle); // Ajoute le titre
    formData.append("categoryId", uploadCateg); // Ajoute la catégorie

    // Envoie les données
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            // Pas besoin de définir le 'Content-Type' ici
        },
        body: formData // Envoie FormData
    })
        .then(response => {
            // Log de la réponse pour inspecter ce qui est retourné
            console.log('Response:', response);

            // Vérifie si la réponse est au format JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json(); // Essaie de parser la réponse en JSON
        })
        .then(data => {
            console.log('Upload réussi:', data);
            showPopup("Upload réussi !", false);
        })
        .catch(error => {
            console.error("Erreur lors de l'upload:", error);
            showPopup("Erreur lors de l'upload.", true);
        });
}
