import { genererWorks } from "./genererWorks.js";

let works = await fetch('http://localhost:5678/api/works');
works = await works.json();

genererWorks(works);

const btnTous = document.querySelector(".btn-tous");
btnTous.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(works);
});

const btnObjets = document.querySelector(".btn-objets");
btnObjets.addEventListener("click", function () {
    const objetsFilter = works.filter(function (work) {
        return work.category.name === "Objets";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(objetsFilter);
});

const btnAppartements = document.querySelector(".btn-appartements");
btnAppartements.addEventListener("click", function () {
    const objetsFilter = works.filter(function (work) {
        return work.category.name === "Appartements";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(objetsFilter);
});

const btnHotel = document.querySelector(".btn-hotel");
btnHotel.addEventListener("click", function () {
    const objetsFilter = works.filter(function (work) {
        return work.category.name === "Hotels & restaurants";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(objetsFilter);
});