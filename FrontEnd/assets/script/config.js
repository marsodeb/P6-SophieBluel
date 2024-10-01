/////////////////////////////////////////////////////
// CONFIG DE BASE POUR RÉCUPÉRATION DES TRAVAUX /////
/////////////////////////////////////////////////////

const api = "http://localhost:5678/api/";

const works = api + "works";
const categories = api + "categories";

export async function fetchCategories() {
    try {
        const response = await fetch(categories);

        if (!response.ok) {
            showPopup("Erreur lors de la récupération des catégories.", true);
            return;
        }

        return await response.json();
    } catch (error) {
        showPopup("Erreur liée au réseau.", true);
    }
}

export async function fetchWorks() {
    try {
        const response = await fetch(works);

        if (!response.ok) {
            showPopup("Erreur lors de la récupération des travaux.", true);
            return;
        }

        return await response.json();
    } catch (error) {
        showPopup("Erreur liée au réseau.", true);
    }
}


export { api, works, categories };