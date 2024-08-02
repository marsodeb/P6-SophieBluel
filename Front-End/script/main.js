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
        const modalButton = document.querySelector(".modal-button");
        const modalTitle = document.querySelector(".modal-title");
        const modalBack = document.querySelector(".modal-back");
        const modalUpload = document.querySelector(".modal-second");
        const modalUploadTitle = document.querySelector(".modal-second .modal-title");
        const modalUploadButton = document.querySelector(".modal-second .modal-button");
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
            modalUploadButton.innerHTML = "<button id='addPhotoBtn'>Valider</button>";
        })

        modalBack.addEventListener("click", function () {
            modalUpload.style.display = "none";
        })

        genererWorksModal(works);
        deletWorks();
        exitModal();
    });
}

function exitModal() {
    const modalExit = document.querySelectorAll(".modal-exit");
    const modal = document.querySelector(".modal");
    modalExit.forEach(close => {
        close.addEventListener("click", function () {
            if (!modalExit) {
                console.error("L'élément '.modal-exit' est introuvable.");
                return;
            }
            modal.style.display = "none";
        })
    })
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