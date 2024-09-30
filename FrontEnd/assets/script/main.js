import { repWorks, fetchWorks } from "./config.js";
import { genWorks } from "./genWorks.js";
import { genCateg } from "./genCateg.js";
import { openModal, closeModal, deletWorks, openSecondModal, secondModal, validateForm, uploadWorks } from "./adminModal.js";
import { showPopup } from "./popUp.js";


fetchWorks().then(data => {
    if (data) {
        genWorks(repWorks);
    }
});

genCateg();


const categButton = document.querySelectorAll(".categ button");
const adminModeVisible = document.querySelector(".adminMode");
const adminEditVisible = document.querySelector(".adminEdit");
const closeModalBtn = document.querySelectorAll(".modalClose");
const modalBack = document.querySelector(".modalBack");
const modalAdminFirst = document.querySelector(".Mfirst");
const modalAdminSecond = document.querySelector(".Msecond")
const nextModal = document.querySelector(".nextModal");
const fileInputContainer = document.querySelector(".uploadFile");
const uploadForm = document.querySelector(".uploadForm");
const submitButton = document.getElementById('goUpload');


for (let i = 0; i < categButton.length; i++) {
    categButton[i].addEventListener("click", filterWorks);
}

function checkAdmin() {
    if (sessionStorage.getItem("token") != null) {
        const logBtn = document.querySelector(".login");
        logBtn.innerHTML = "<a href='./pages/login.html'>logout</a>";
        logBtn.addEventListener("click", () => { sessionStorage.removeItem("token") })
        adminModeVisible.style.visibility = "visible";
        adminModeVisible.style.maxHeight = "100%";
        adminEditVisible.style.visibility = "visible";
        showPopup("Vous êtes connectés.", false);
    }
}
checkAdmin();

function filterWorks(e) {
    const sectionProjets = document.querySelector(".gallery");
    sectionProjets.innerHTML = "";

    const buttons = document.querySelectorAll(".buttonCateg");

    buttons.forEach(button => {
        button.classList.remove("selectedCateg");
    });

    e.target.classList.add("selectedCateg");

    // On va chercher les travaux récents
    fetchWorks().then(repWorks => {
        if (e.target.id != 0) {
            const filteredWorks = repWorks.filter(work => work.category.name === e.target.innerText);
            genWorks(filteredWorks);
        } else {
            genWorks(repWorks);
        }
    });
}

adminEditVisible.addEventListener("click", () => {
    if (sessionStorage.getItem("token") != null) {
        openModal();
    }
});

nextModal.addEventListener("click", () => {
    if (sessionStorage.getItem("token") != null) {
        openSecondModal();
    }
})

closeModalBtn.forEach(button => {
    button.addEventListener("click", () => {
        closeModal();
    });
});


modalAdminFirst.addEventListener("click", (event) => {
    if (event.target == modalAdminFirst) {
        closeModal();
    }
})

modalAdminSecond.addEventListener("click", (event) => {
    if (event.target == modalAdminSecond) {
        closeModal();
    }
})

modalBack.addEventListener("click", () => {
    modalAdminSecond.style.visibility = "hidden";
    secondModal();
    openModal();
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('trash') && sessionStorage.getItem("token") != null) {
        deletWorks(event);
    }
});

fileInputContainer.addEventListener("change", function (event) {
    if (event.target && event.target.id === "uploadFile") {
        const logoUpload = document.querySelector(".logoUpload");
        const labelUpload = document.querySelector(".labelUpload");
        const spanUpload = document.querySelector(".infoUpload");
        logoUpload.remove();
        labelUpload.remove();
        spanUpload.remove();
        const [file] = event.target.files;
        const fileInputImage = document.createElement("img");
        fileInputImage.src = URL.createObjectURL(file);
        fileInputImage.classList = "previewUpload";
        fileInputContainer.appendChild(fileInputImage);
    }
});

uploadForm.addEventListener("change", (event) => {
    if (validateForm()) {
        submitButton.classList.remove('inactive');
        submitButton.classList.add('active');
    } else {
        submitButton.classList.remove('active');
        submitButton.classList.add('inactive');
    }
});

submitButton.addEventListener("click", (event) => {
    if (validateForm()) {
        event.preventDefault();
        uploadWorks();
    } else {
        event.preventDefault();
    }
})


























