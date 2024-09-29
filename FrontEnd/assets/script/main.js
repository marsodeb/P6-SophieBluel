import { repWorks } from "./config.js";
import { genWorks } from "./genWorks.js";
import { filterWorks, genCateg } from "./genCateg.js";
import { openModal, closeModal, deletWorks, openSecondModal } from "./adminModal.js";
import { showPopup } from "./popUp.js";


genWorks(repWorks);
genCateg();

const categButton = document.querySelectorAll(".categ button");
const adminModeVisible = document.querySelector(".adminMode");
const adminEditVisible = document.querySelector(".adminEdit");
const closeModalBtn = document.querySelectorAll(".modalClose");
const modalAdminFirst = document.querySelector(".Mfirst");
const modalAdminSecond = document.querySelector(".Msecond")
const nextModal = document.querySelector(".nextModal");

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

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('trash') && sessionStorage.getItem("token") != null) {
        deletWorks(event);
    }
});

























