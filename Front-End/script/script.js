import { genererWorks, genererWorksModal } from "./genererWorks.js";

let works;
let categorie;
let isLogged = false;

async function fetchData() {
    works = await fetch('http://localhost:5678/api/works');
    works = await works.json();
    categorie = await fetch('http://localhost:5678/api/categories');
    categorie = await categorie.json();
}

async function main() {
    await fetchData();

    genererWorks(works);
    filterCreate();
    isAdminLogged();
    openModal();
    exitModal();
}

function filterCreate() {
    const filter = document.querySelector(".filter");
    const buttonAll = document.createElement("button");
    buttonAll.innerText = "Tous";
    filter.appendChild(buttonAll);
    for (var i = 0; i < categorie.length; i++) {
        const buttonFilter = document.createElement("button");
        buttonFilter.innerText = categorie[i].name;
        filter.appendChild(buttonFilter);
    }
    filterDisplay();
}

function filterDisplay() {
    const button = document.querySelectorAll(".filter button");
    button.forEach(buttons => {
        buttons.addEventListener("click", function (e) {
            const objetsFilter = works.filter(function (work) {
                return work.category.name === e.target.innerText;
            });
            document.querySelector(".gallery").innerHTML = "";
            if (e.target.innerText == "Tous") {
                genererWorks(works);
            } else {
                genererWorks(objetsFilter);
            }
        });
    });
}

function isAdminLogged() {
    if (sessionStorage.getItem("token") != null) {
        isLogged = true;
        document.getElementById("logBtn").innerHTML = "<a href='login.html'>logout</a>";
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        const popup = document.querySelector(".logged");
        popup.style.visibility = "visible";
        document.getElementById("logBtn").addEventListener("click", function () {
            sessionStorage.removeItem("token");
            isLogged = false;
            fetchData().then(() => {
                genererWorks(works);
                filterCreate();
            });
        });
    }
}

function openModal() {
    if (isLogged === true) {
        document.querySelector(".admin-modif").addEventListener('click', function () {
            document.querySelector(".modal").style.display = "flex";
            genererWorksModal(works);
            deletWorks(); // Appel de deletWorks après la génération de la modal
        });
    }
    document.querySelector(".modal-exit").addEventListener('click', function () {
        exitModal();
    });
}

function exitModal() {
    document.querySelector(".modal").style.display = "none";
    document.querySelector(".modal-content").innerHTML = "";
}

function deletWorks() {
    let token = sessionStorage.getItem("token");
    const delet = document.querySelectorAll(".modal-content span");
    delet.forEach(delets => {
        delets.addEventListener('click', function (e) {
            console.log(e.currentTarget.id);
            let targetId = e.currentTarget.id;
            fetch("http://localhost:5678/api/works/" + e.currentTarget.id, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (response.ok) {
                    works = works.filter((work) => work.id != targetId);
                    document.querySelector(".gallery").innerHTML = "";
                    genererWorks(works);
                    document.querySelector(".modal-content").innerHTML = "";
                    genererWorksModal(works);
                    deletWorks(); // Appel de deletWorks après mise à jour de la modal
                } else {
                    alert("Erreur : " + response.status);
                }
            });
        });
    });
}

main();
