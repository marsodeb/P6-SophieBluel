import { genererWorks, genererWorksModal } from "./genererWorks.js";
import { showPopup } from "./showPopup.js"; // Assurez-vous que l'importation est correcte

let works;
let categorie;
let isLogged = false;

async function fetchData() {
    try {
        const responseWorks = await fetch('http://localhost:5678/api/works');
        works = await responseWorks.json();
        const responseCategories = await fetch('http://localhost:5678/api/categories');
        categorie = await responseCategories.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
}

async function main() {
    await fetchData();

    if (works && categorie) {
        genererWorks(works);
        filterCreate();
        isAdminLogged();
        openModal();
        exitModal();
    } else {
        console.error("Erreur de données, impossible d'initialiser les composants.");
    }
}

function filterCreate() {
    const filter = document.querySelector(".filter");
    if (!filter) return; // Vérifiez si l'élément existe
    const buttonAll = document.createElement("button");
    buttonAll.innerText = "Tous";
    filter.appendChild(buttonAll);
    for (let i = 0; i < categorie.length; i++) {
        const buttonFilter = document.createElement("button");
        buttonFilter.innerText = categorie[i].name;
        filter.appendChild(buttonFilter);
    }
    filterDisplay();
}

function filterDisplay() {
    const buttons = document.querySelectorAll(".filter button");
    buttons.forEach(button => {
        button.addEventListener("click", function (e) {
            const objetsFilter = works.filter(work => work.category.name === e.target.innerText);
            document.querySelector(".gallery").innerHTML = "";
            if (e.target.innerText === "Tous") {
                genererWorks(works);
            } else {
                genererWorks(objetsFilter);
            }
        });
    });
}

function isAdminLogged() {
    if (sessionStorage.getItem("token") !== null) {
        isLogged = true;
        const logBtn = document.getElementById("logBtn");
        if (logBtn) {
            logBtn.innerHTML = "<a href='login.html'>logout</a>";
            logBtn.addEventListener("click", function () {
                sessionStorage.removeItem("token");
                isLogged = false;
                fetchData().then(() => {
                    genererWorks(works);
                    filterCreate();
                });
            });
        }
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        showPopup("Vous êtes en mode admin.");
    }
}

function openModal() {
    if (isLogged) {
        const adminModif = document.querySelector(".admin-modif");
        if (adminModif) {
            adminModif.addEventListener('click', function () {
                const modal = document.querySelector(".modal");
                if (modal) {
                    modal.style.display = "flex";
                    genererWorksModal(works);
                    deletWorks(); // Appel de deletWorks après la génération de la modal
                }
            });
        }
    }
    const modalExit = document.querySelector(".modal-exit");
    if (modalExit) {
        modalExit.addEventListener('click', function () {
            exitModal();
        });
    }
}

function exitModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
        modal.style.display = "none";
    }
    const modalContent = document.querySelector(".modal-content");
    if (modalContent) {
        modalContent.innerHTML = "";
    }
}

function deletWorks() {
    const token = sessionStorage.getItem("token");
    const deletButtons = document.querySelectorAll(".modal-content .delet");
    deletButtons.forEach(delet => {
        delet.addEventListener('click', function (e) {
            const targetId = e.currentTarget.id;
            fetch(`http://localhost:5678/api/works/${targetId}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (response.ok) {
                    works = works.filter(work => work.id != targetId);
                    document.querySelector(".gallery").innerHTML = "";
                    genererWorks(works);
                    document.querySelector(".modal-content").innerHTML = "";
                    genererWorksModal(works);
                    deletWorks(); // Appel de deletWorks après mise à jour de la modal
                    showPopup("Travail supprimé avec succès."); // Affiche la popup après la suppression
                } else {
                    showPopup("Erreur : " + response.status, true); // Affiche la popup d'erreur
                }
            }).catch((error) => {
                showPopup("Erreur réseau ou serveur", true);
                console.error("Erreur de connexion : ", error);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
});
