const api = "http://localhost:5678/api/";

const works = api + "works";
const categories = api + "categories";

const fetchWork = await fetch(works);
const repWorks = await fetchWork.json();

const fetchCateg = await fetch(categories);
const repCateg = await fetchCateg.json();

export function fetchWorks() {
    return fetch(works)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des travaux");
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            showPopup("Erreur lors de la récupération des travaux.", true);
        });
}


export { api, works, categories, repWorks, repCateg };