/////////////////////////////////////////////////////
// CRÉATION DYNAMIQUE DES BOUTONS CATEGORIES    /////
/////////////////////////////////////////////////////

export function genCateg(categories) {

    const sectionCateg = document.querySelector(".categ")

    const allButton = document.createElement("button");
    allButton.classList = "buttonCateg selectedCateg";
    allButton.id = "0";
    allButton.innerText = "Tous";
    sectionCateg.appendChild(allButton);

    for (let i = 0; i < categories.length; i++) {

        const categ = categories[i];

        const categButton = document.createElement("button");

        categButton.classList = "buttonCateg";
        categButton.id = categ.id;
        categButton.innerText = categ.name;

        sectionCateg.appendChild(categButton);
    }
}



