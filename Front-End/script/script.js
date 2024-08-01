import { genererWorks } from "./genererWorks.js";
let works = await fetch('http://localhost:5678/api/works');
works = await works.json();
let categorie = await fetch('http://localhost:5678/api/categories');
categorie = await categorie.json();

let isLogged = false;

genererWorks(works);
filterCreate();
isAdminLogged();
openModal();
exitModal();

function filterCreate() {
    const filter = document.querySelector(".filter");
    const buttonAll = document.createElement("button");
    buttonAll.innerText = "Tous";
    filter.appendChild(buttonAll);
    for (var i = 0; i < categorie.length; i++) {
        const buttonFilter = document.createElement("button");
        buttonFilter.innerText = categorie[i].name;
        filter.appendChild(buttonFilter);
        filterDisplay();
    }
}

function filterDisplay() {
    const button = document.querySelectorAll(".filter button");
    button.forEach(buttons => {
        buttons.addEventListener("click", function (e) {
            const objetsFilter = works.filter(function (work) {
                return work.category.name === e.target.innerText;
            })
            if (e.target.innerText == "Tous") {
                document.querySelector(".gallery").innerHTML = "";
                genererWorks(works);
            } else {
                document.querySelector(".gallery").innerHTML = "";
                genererWorks(objetsFilter);
            }
        });
    });
}

function isAdminLogged() {
    if (sessionStorage.getItem("token") != null) {
        isLogged = true;
        document.getElementById("logBtn").innerHTML = "<a href=" + "login.html" + ">logout</a>";
        document.querySelector(".filter-container").style.visibility = "hidden";
        document.querySelector(".edition-banner").style.display = "flex";
        document.querySelector(".admin-modif").style.display = "flex";
        const popup = document.querySelector(".logged");
        popup.style.visibility = "visible";
        document.getElementById("logBtn").addEventListener("click", function () {
            sessionStorage.removeItem("token");
        })
    }
}

function openModal() {
    if (isLogged === true) {
        document.querySelector(".admin-modif").addEventListener('click', function () {
            document.querySelector(".modal").style.display = "flex";
            for (var i = 0; i < works.length; i++) {
                const projets = works[i];
                const imageContent = document.querySelector(".modal-content");
                const div = document.createElement("div")
                const image = document.createElement("img");
                const delet = document.createElement("span");
                delet.setAttribute("class", "delet");
                delet.innerHTML = "<i class='fa-solid fa-trash-can'></i>"
                image.src = projets.imageUrl;
                imageContent.appendChild(div);
                div.appendChild(image);
                div.appendChild(delet);
            }
        })
    }
}

function exitModal() {
    document.querySelector(".modal-exit").addEventListener('click', function () {
        document.querySelector(".modal").style.display = "none";
        document.querySelector(".modal-content").innerHTML = "";
    })
}