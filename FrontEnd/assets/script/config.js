/////////////////////////////////////////////////////
// CONFIG DE BASE POUR RÉCUPÉRATION DES TRAVAUX /////
/////////////////////////////////////////////////////

const api = "http://localhost:5678/api/";

const works = api + "works";
const categories = api + "categories";

const fetchCateg = await fetch(categories);
const repCateg = await fetchCateg.json();

export function fetchWorks() {
    return fetch(works)
        .then(response => {
            if (!response.ok) {
                showPopup("Erreur lors de la récupération des travaux.", true);
                return;
            }
            return response.json();
        });
}


export { api, works, categories, repCateg };