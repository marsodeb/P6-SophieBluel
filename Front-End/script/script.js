import { genererWorks } from "./genererWorks.js";
let works = await fetch('http://localhost:5678/api/works');
works = await works.json();
let categorie = await fetch('http://localhost:5678/api/categories');
categorie = await categorie.json();

let isLogged = false;

genererWorks(works);
filterCreate();
filterDisplay();
isAdminLogged();

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
        const popup = document.querySelector(".logged");
        popup.style.visibility = "visible";
        document.getElementById("logBtn").addEventListener("click", function () {
            sessionStorage.removeItem("token");
        })
    }
}