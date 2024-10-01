import { fetchWorks, fetchCategories } from "./config.js";
import { genWorks } from "./genWorks.js";
import { showPopup } from "./popUp.js";

/////////////////////////////////////////////////////
// GESTION MODAL ADMIN                ///////////////
/////////////////////////////////////////////////////
// INDEX : 1- OUVERTURE / FERMETURE DES MODALS     //
//         2- CRÉATION DES ÉLÉMENTS DES MODALS     //
//         3- GESTION DE LA SUPPRESSION            //
//         4- GESTION DE L'UPLOAD                  //
//                                                 //
/////////////////////////////////////////////////////

const modalAdminFirst = document.querySelector(".Mfirst");
const modalAdminSecond = document.querySelector(".Msecond");
const modalGallery = document.querySelector(".modalGallery");


/////////////////////////////////////////////////////
// 1 - OUVERTURE / FERMETURE DES MODALS  ////////////
/////////////////////////////////////////////////////

export function closeModal() {

    modalAdminFirst.style.visibility = "hidden";
    modalAdminSecond.style.visibility = "hidden";

}

export function openModal() {

    modalAdminFirst.style.visibility = "visible";

    fetchWorks().then(data => {
        if (data) {
            firstModal(data);
        }
    });
}

export function openSecondModal() {

    modalAdminFirst.style.visibility = "hidden";
    modalAdminSecond.style.visibility = "visible";

    secondModal();
}

/////////////////////////////////////////////////////
// 2 - CRÉATION DES ÉLÉMENTS DES MODALS            //
/////////////////////////////////////////////////////

export function firstModal(works) {

    modalGallery.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const projet = works[i];

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

function uploadCateg(categories) {
    const uploadCategories = document.getElementById("uploadCateg");

    uploadCategories.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {

        const categ = categories[i];

        const uploadCategOption = document.createElement("option");

        uploadCategOption.innerText = categ.name;
        uploadCategOption.value = categories[i].id;

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

    fetchCategories().then(data => {
        if (data) {
            uploadCateg(data);
        }
    });
}

/////////////////////////////////////////////////////
// 3 - GESTION DE LA SUPPRESSION                   //
/////////////////////////////////////////////////////

export async function deletWorks(event) {
    event.preventDefault();

    if (sessionStorage.getItem("token") != null) {
        const token = sessionStorage.getItem("token");
        const workId = event.target.id;

        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: { authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                showPopup("Suppression du travail réussie.", false);
                const worksResponse = await fetch("http://localhost:5678/api/works");
                const data = await worksResponse.json();
                firstModal(data);
                genWorks(data);
            } else {
                showPopup("Suppression du travail échouée.", true);
            }
        } catch (error) {
            showPopup("Erreur liée au réseau.", true);
        }
    }
}

/////////////////////////////////////////////////////
// 4 - GESTION DE L'UPLOAD                         //
/////////////////////////////////////////////////////

export function validateForm() {

    const uploadFile = document.querySelector("#uploadFile");
    const uploadTitle = document.querySelector("#uploadTitle");
    const uploadCateg = document.querySelector(".uploadCateg");

    const file = uploadFile.files[0];
    const title = uploadTitle.value;
    const category = uploadCateg.value;

    if (!file) {
        showPopup("Aucun fichier sélectionné.", true);
        return false;
    }

    const fileSizeMB = file.size / (1024 * 1024); // Info stackoverflow pour le calcul des tailles
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

export async function uploadWorks() {
    if (sessionStorage.getItem("token") != null) {
        const token = sessionStorage.getItem("token");

        const title = document.querySelector('input[name="title"]').value;
        const categoryId = document.querySelector('select[name="categoryId"]').value;
        const image = document.querySelector('input[name="imageUrl"]').files[0];

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", categoryId);
        formData.append("image", image);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                showPopup("Ajout du travail réussie.", false);
                const worksResponse = await fetch("http://localhost:5678/api/works");
                const data = await worksResponse.json();
                genWorks(data);
                secondModal();
            } else {
                showPopup("Ajout du travail échouée.", true);
            }
        } catch (error) {
            showPopup("Erreur liée au réseau.", true);
        }
    }
}