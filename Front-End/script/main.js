import { genererWorks, filterCreate, genererWorksModal } from "./genererWorks.js";
import { showPopup } from "./showPopup.js";

let works, categorie;

async function fetchData() {
    try {
        const [worksResponse, categoriesResponse] = await Promise.all([
            fetch('http://localhost:5678/api/works'),
            fetch('http://localhost:5678/api/categories')
        ]);
        works = await worksResponse.json();
        categorie = await categoriesResponse.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}

function main() {
    fetchData().then(() => {
        if (works && categorie) {
            genererWorks(works);
            filterCreate(categorie, works);
            checkAdminStatus();
        } else {
            console.error("Erreur de données, impossible d'initialiser les composants.");
        }
    });
}

function checkAdminStatus() {
    if (sessionStorage.getItem("token")) {
        showPopup("Vous êtes bien connecté(e) !", false);
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        const logBtn = document.getElementById("logBtn");
        logBtn.innerHTML = "<a href='login.html'>logout</a>";
        openModal();
        logBtn.addEventListener("click", function () {
            sessionStorage.removeItem("token")
        })
    }
}

function openModal() {
    document.querySelector(".admin-modif").addEventListener('click', () => {
        const modal = document.querySelector(".modal");
        const modalButton = document.querySelector(".modal-first .modal-button");
        const modalTitle = document.querySelector(".modal-title");
        const modalBack = document.querySelector(".modal-back");
        const modalUpload = document.querySelector(".modal-second");
        const modalUploadTitle = document.querySelector(".modal-second .modal-title");
        const modalUploadButton = document.querySelector(".modal-second .modal-button #uploadBtn");
        const modalUploadCategories = document.getElementById("imageCategory");
        const previewImage = document.getElementById('previewImage');
        const imageFileInput = document.getElementById('imageFile');
        const labelPhoto = document.getElementById('labelPhoto');
        if (!modal) {
            console.error("L'élément '.modal' est introuvable.");
            return;
        }
        modal.style.display = "flex";
        modalTitle.innerHTML = "<h2>Galerie photo</h2>";
        modalButton.innerHTML = "<button id='addPhotoBtn'>Ajouter une photo</button>";

        modalButton.addEventListener("click", function () {
            modalUpload.style.display = "flex";
            modalUploadTitle.innerHTML = "<h2>Ajout photo</h2>";
            modalUploadCategories.innerHTML = "";
            for (var i = 0; i < categorie.length; i++) {
                const uploadCategories = document.createElement("option")
                uploadCategories.setAttribute("value", categorie[i].id)
                uploadCategories.innerText = categorie[i].name;
                modalUploadCategories.appendChild(uploadCategories);
            }
        })
        modalUploadButton.addEventListener("click", function () {
            if (modalUploadButton.classList != "btn-not-selected") {
                uploadModal();
            } else {
                showPopup("Vous devez d'abord compléter le formulaire d'upload.", true);
            }
        })

        modalBack.addEventListener("click", function () {
            modalUpload.style.display = "none";
            modalUploadCategories.innerHTML = "";
            if (previewImage.src != "") {
                previewImage.src = "";
                labelPhoto.style.display = 'flex';
                modalUploadButton.classList = 'btn-not-selected';
            }
        })

        imageFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0]; // Prendre le premier fichier sélectionné
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewContainer.style.display = 'block';
                    labelPhoto.style.display = 'none';
                    modalUploadButton.classList = '';
                };
                reader.readAsDataURL(file); // Lire le fichier comme une URL de données
            } else {
                showPopup("Le fichier n'est pas une image.", true);
            }
        });
        genererWorksModal(works);
        deletWorks();
        exitModal();
    });
}

function exitModal() {
    const modalExit = document.querySelectorAll(".modal-exit");
    const modal = document.querySelector(".modal");
    const modalUpload = document.querySelector(".modal-second");
    const modalUploadCategories = document.getElementById("imageCategory");
    const previewImage = document.getElementById('previewImage');
    const labelPhoto = document.getElementById('labelPhoto');
    const modalUploadButton = document.querySelector(".modal-second .modal-button #uploadBtn");
    modalExit.forEach(close => {
        close.addEventListener("click", function () {
            if (!modalExit) {
                console.error("L'élément '.modal-exit' est introuvable.");
                return;
            }
            if (previewImage.src != "") {
                previewImage.src = "";
                labelPhoto.style.display = 'flex';
                modalUploadButton.classList = 'btn-not-selected';
            }
            modal.style.display = "none";
            modalUpload.style.display = "none";
            modalUploadCategories.innerHTML = "";
        })
    })
}

function uploadModal() {
    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);
    const previewImage = document.getElementById('previewImage');
    const labelPhoto = document.getElementById('labelPhoto');
    const modalUploadButton = document.querySelector(".modal-second .modal-button #uploadBtn");
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Upload successful:', data);
            fetchData().then(() => {
                genererWorks(works);
                genererWorksModal(works);
                deletWorks();
                const modalUpload = document.querySelector(".modal-second");
                modalUpload.style.display = "none";
                previewImage.src = "";
                labelPhoto.style.display = 'flex';
                modalUploadButton.classList = 'btn-not-selected';
                showPopup("Travail ajouté avec succès.");
            });
        })
        .catch(error => {
            showPopup("Erreur lors de l'upload.", true);
        });
}

function deletWorks() {
    const token = sessionStorage.getItem("token");
    document.querySelectorAll(".modal-content .delet").forEach(delet => {
        delet.addEventListener('click', (e) => {
            const targetId = e.currentTarget.id;
            fetch(`http://localhost:5678/api/works/${targetId}`, {
                method: "DELETE",
                headers: { authorization: `Bearer ${token}` },
            }).then((response) => {
                if (response.ok) {
                    works = works.filter(work => work.id != targetId);
                    genererWorks(works);
                    genererWorksModal(works);
                    deletWorks();
                    showPopup("Travail supprimé avec succès.");
                } else {
                    showPopup("Erreur : " + response.status, true);
                }
            }).catch((error) => {
                showPopup("Erreur réseau ou serveur", true);
                console.error("Erreur de connexion : ", error);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', main);