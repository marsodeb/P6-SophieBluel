// Importation des fonctions nécessaires
import { genererWorks, filterCreate, genererWorksModal } from "./genererWorks.js";
import { showPopup } from "./showPopup.js";

// Variables globales
let works, categorie;

// Fonction pour récupérer les données des œuvres et des catégories
async function fetchData() {
    try {
        const [worksResponse, categoriesResponse] = await Promise.all([
            fetch('http://localhost:5678/api/works'),
            fetch('http://localhost:5678/api/categories')
        ]);
        works = await worksResponse.json();
        categorie = await categoriesResponse.json();
        console.log("Données récupérées avec succès", { works, categorie });
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}

// Fonction principale d'initialisation
function main() {
    console.log("Appel de la fonction main");
    fetchData().then(() => {
        if (works && categorie) {
            console.log("Les données ont été récupérées");
            genererWorks(works);
            filterCreate(categorie, works);
            checkAdminStatus();
        } else {
            console.error("Erreur de données, impossible d'initialiser les composants.");
        }
    });
}

// Vérifie si l'utilisateur est connecté et ajuste l'affichage de la modal
function checkAdminStatus() {
    if (sessionStorage.getItem("token")) {
        showPopup("Vous êtes bien connecté(e) !", false);
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        const logBtn = document.getElementById("logBtn");
        logBtn.innerHTML = "<a href='login.html'>logout</a>";
        setupModal(); // Configuration de la modal
        logBtn.addEventListener("click", function (event) {
            sessionStorage.removeItem("token");
        });
    }
}

// Configure les événements pour la modal
function setupModal() {
    document.querySelector(".admin-modif").addEventListener('click', function () {
        openModal();
    });
}

// Fonction pour ouvrir la modal
function openModal() {
    const modal = document.querySelector(".modal");
    const modalFirst = document.querySelector(".modal-first");
    const modalUpload = document.querySelector(".modal-second");

    if (!modal) {
        console.error("L'élément '.modal' est introuvable.");
        return;
    }

    showModalFirst();
    setupModalEvents();

    function showModalFirst() {
        modal.style.display = "flex";
        modalFirst.style.display = "flex";
        modalUpload.style.display = "none";
        modalFirst.querySelector(".modal-title").innerHTML = "<h2>Galerie photo</h2>";
        modalFirst.querySelector(".modal-button").innerHTML = "<button id='addPhotoBtn' type='button'>Ajouter une photo</button>";
    }

    function showModalUpload() {
        modalFirst.style.display = "none";
        modalUpload.style.display = "flex";
        modalUpload.querySelector(".modal-title").innerHTML = "<h2>Ajout photo</h2>";
        genererCategories();
    }

    function genererCategories() {
        const modalUploadCategories = document.getElementById("imageCategory");
        modalUploadCategories.innerHTML = ""; // Clear existing options

        categorie.forEach(cat => {
            const uploadCategories = document.createElement("option");
            uploadCategories.setAttribute("value", cat.id);
            uploadCategories.innerText = cat.name;
            modalUploadCategories.appendChild(uploadCategories);
        });
    }

    function setupModalEvents() {
        const modalButton = modalFirst.querySelector(".modal-button");
        const modalUploadButton = modalUpload.querySelector(".modal-button #uploadBtn");
        const imageFileInput = document.getElementById('imageFile');
        const labelPhoto = document.getElementById('labelPhoto');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        const uploadForm = document.getElementById('uploadForm');

        modalButton.addEventListener("click", function (event) {
            event.preventDefault();
            showModalUpload();
        });

        modalUploadButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!modalUploadButton.classList.contains('btn-not-selected') && uploadForm.checkValidity()) {
                uploadModal();
            } else {
                showPopup("Vous devez d'abord compléter le formulaire d'upload.", true);
            }
        });

        imageFileInput.addEventListener("change", function (event) {
            event.preventDefault();
            const [file] = imageFileInput.files;
            if (file) {
                previewImage.src = URL.createObjectURL(file);
                labelPhoto.style.display = 'none';
                previewContainer.style.display = 'flex';
                modalUploadButton.classList.remove('btn-not-selected');
            } else {
                showPopup("Le fichier n'est pas une image.", true);
            }
        });

        document.querySelector(".modal-back").addEventListener("click", function (event) {
            event.preventDefault();
            resetUploadModal();
            showModalFirst(); // Reaffiche la première partie de la modal
        });

        genererWorksModal(works);
        deletWorks();
        exitModal();
    }
}

// Gère la fermeture de la modal
function exitModal() {
    const modalExit = document.querySelectorAll(".modal-exit");
    const modal = document.querySelector(".modal");
    const modalUploadCategories = document.getElementById("imageCategory");

    modalExit.forEach(close => {
        close.addEventListener("click", function (event) {
            event.preventDefault();
            resetUploadModal();
            modal.style.display = "none";
            document.querySelector(".modal-second").style.display = "none";
            modalUploadCategories.innerHTML = "";
        });
    });
}

// Fonction pour réinitialiser la modal d'upload
function resetUploadModal() {
    const previewImage = document.getElementById('previewImage');
    const labelPhoto = document.getElementById('labelPhoto');
    const modalUploadButton = document.querySelector(".modal-second .modal-button #uploadBtn");
    const imageFileInput = document.getElementById('imageFile');
    const previewContainer = document.getElementById('previewContainer');

    imageFileInput.value = "";
    previewImage.src = "";
    labelPhoto.style.display = 'flex';
    modalUploadButton.classList.add('btn-not-selected');
    previewContainer.style.display = 'none';
}

// Fonction pour gérer l'upload de l'image
function uploadModal() {
    const form = document.getElementById("uploadForm");
    const formData = new FormData(form);

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
                document.querySelector(".modal-second").style.display = "none";
                document.querySelector(".modal-first").style.display = "flex";
                resetUploadModal();
                showPopup("Travail ajouté avec succès.");
            });
        })
        .catch(error => {
            showPopup("Erreur lors de l'upload.", true);
        });
}

// Fonction pour gérer la suppression des œuvres
function deletWorks() {
    const token = sessionStorage.getItem("token");

    document.querySelectorAll(".modal-content .delet").forEach(delet => {
        delet.addEventListener("click", function (event) {
            event.preventDefault(); // Empêche le rechargement de la page
            const targetId = event.currentTarget.id;

            fetch(`http://localhost:5678/api/works/${targetId}`, {
                method: "DELETE",
                headers: { authorization: `Bearer ${token}` },
            })
                .then(response => {
                    if (response.ok) {
                        works = works.filter(work => work.id != targetId);
                        genererWorks(works);
                        genererWorksModal(works);
                        deletWorks();
                        showPopup("Travail supprimé avec succès.");
                    } else {
                        showPopup("Erreur : " + response.status, true);
                    }
                })
                .catch(error => {
                    showPopup("Erreur réseau ou serveur", true);
                    console.error("Erreur de connexion : ", error);
                });
        });
    });
}

// Initialisation au chargement du document
document.addEventListener('DOMContentLoaded', main);
