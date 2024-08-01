import { genererWorks, genererWorksModal } from "./genererWorks.js";
import { showPopup } from "./showPopup.js";

let works, categorie;
let isLogged = false;

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

function setupEventListeners() {
    const logBtn = document.getElementById("logBtn");
    if (logBtn) {
        logBtn.innerHTML = isLogged ? "<a href='login.html'>logout</a>" : "<a href='login.html'>login</a>";
        logBtn.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            isLogged = false;
            fetchData().then(() => {
                genererWorks(works);
                filterCreate();
            });
        });
    }

    document.querySelector(".modal-exit")?.addEventListener('click', exitModal);
}

function main() {
    fetchData().then(() => {
        if (works && categorie) {
            genererWorks(works);
            filterCreate();
            checkAdminStatus();
            setupEventListeners();
        } else {
            console.error("Erreur de données, impossible d'initialiser les composants.");
        }
    });
}

function filterCreate() {
    const filter = document.querySelector(".filter");
    if (!filter) return;

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
        button.addEventListener("click", action);
        filter.appendChild(button);
    });
}

function checkAdminStatus() {
    if (sessionStorage.getItem("token")) {
        isLogged = true;
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        showPopup("Vous êtes en mode admin.");
        setupAdminModifButton();
    }
}

function setupAdminModifButton() {
    document.querySelector(".admin-modif")?.addEventListener('click', () => {
        const modal = document.querySelector(".modal");
        if (modal) {
            modal.style.display = "flex";
            resetModalContent();
            genererWorksModal(works);
            setupDeletion();
        }
    });
}

function resetModalContent() {
    const modalContent = document.querySelector(".modal-content");
    const modalButton = document.querySelector(".modal-button");
    const modalTitle = document.querySelector(".modal-title h2");
    const modalBack = document.querySelector(".modal-back");

    if (modalContent) {
        modalContent.className = 'modal-content gallery-view'; // Réinitialiser les classes
        genererWorksModal(works); // Régénérer la galerie
        setupDeletion(); // Réattacher les événements de suppression

        if (modalTitle) modalTitle.innerHTML = "<h2>Galerie photo</h2>";
        if (modalButton) modalButton.innerHTML = "<button id='addPhotoBtn'>Ajouter une photo</button>";
        if (modalBack) modalBack.innerHTML = "";

        document.getElementById("addPhotoBtn")?.addEventListener('click', showUploadForm);
    }
}

function exitModal() {
    const modal = document.querySelector(".modal");
    if (modal) modal.style.display = "none";
    resetModalContent(); // Réinitialiser le contenu de la modale à chaque sortie
}

function showUploadForm() {
    const modalContent = document.querySelector(".modal-content");
    const modalTitle = document.querySelector(".modal-title h2");
    const modalBack = document.querySelector(".modal-back");
    const modalButton = document.querySelector(".modal-button");

    if (modalContent && modalTitle && modalBack && modalButton) {
        modalContent.className = 'modal-content upload-view'; // Changer de vue

        modalTitle.innerHTML = `<h2>Ajouter une nouvelle photo</h2>`;
        modalBack.innerHTML = `<i id="backButton" class="fa-solid fa-arrow-left"></i>`;

        // Assurez-vous de ne pas créer les éléments plus d'une fois
        modalContent.innerHTML = `
            <form id="uploadForm">
                <div id="labelPhoto">
                    <img src="./assets/icons/picture.png" id="picture" alt="choisir une image">
                    <input type="file" id="imageFile" name="image" accept="image/*" required style="display: none;">
                    <div id="previewContainer" style="display: none;">
                        <img id="previewImage" src="" alt="Prévisualisation" style="min-width: 150px;">
                    </div>
                    <p id="fileFormatText">jpg, png : 4mo max</p>
                </div>
                <label for="imageTitle">Titre :</label>
                <input type="text" id="imageTitle" name="title" required>
                <label for="imageCategory">Catégorie :</label>
                <select id="imageCategory" name="category" required>
                    ${categorie.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                </select>
            </form>
        `;

        // Ajouter le bouton de soumission
        const submitButton = document.createElement("button");
        submitButton.innerText = "Envoyer";
        submitButton.type = "submit";
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleUpload();
        });
        modalButton.innerHTML = ""; // Vider le contenu actuel
        modalButton.appendChild(submitButton);

        // Gestionnaire pour le bouton de retour
        const backButton = document.getElementById("backButton");
        if (backButton) {
            backButton.addEventListener('click', resetToGalleryView);
        }

        // Gestionnaire pour ouvrir le sélecteur de fichiers
        const labelPhoto = document.getElementById('labelPhoto');
        const imageFileInput = document.getElementById('imageFile');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        const pictureImage = document.getElementById('picture');
        const fileFormatText = document.getElementById('fileFormatText');

        if (labelPhoto && imageFileInput) {
            // Ouvrir la boîte de dialogue de fichiers lorsque labelPhoto est cliqué
            labelPhoto.addEventListener('click', () => {
                imageFileInput.click();
            });

            // Fonction pour gérer le changement de fichier et afficher la prévisualisation
            imageFileInput.addEventListener('change', (event) => {
                const file = event.target.files[0]; // Prendre le premier fichier sélectionné
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewImage.src = e.target.result;
                        previewContainer.style.display = 'block'; // Afficher la prévisualisation
                        pictureImage.style.display = 'none'; // Masquer l'image par défaut
                        fileFormatText.style.display = 'none'; // Masquer le texte de format
                    };
                    reader.readAsDataURL(file); // Lire le fichier comme une URL de données
                } else {
                    console.error('Le fichier sélectionné n\'est pas une image.');
                }
            });
        }
    }
}

function handleUpload() {
    const form = document.getElementById("uploadForm");
    if (form) {
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
                    resetToGalleryView(); // Revenir à la vue galerie après l'upload
                });
            })
            .catch(error => {
                console.error('Erreur lors de l\'upload:', error);
            });
    }
}

function resetToGalleryView() {
    resetModalContent(); // Réinitialiser la vue de la galerie
}

function setupDeletion() {
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
                    setupDeletion(); // Réattacher les événements de suppression
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
