import { showPopup } from "./showPopup.js"; // Assurez-vous que showPopup est bien exportée depuis script.js

// Vérifiez si le formulaire existe avant d'ajouter un écouteur d'événement
const formulaireLogin = document.querySelector(".formulaire-login");
if (formulaireLogin) {
    formulaireLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        // Création de l’objet du nouvel avis.
        const login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login);

        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        }).then((response) => {
            if (response.status !== 200) {
                // Affiche la popup d'erreur
                showPopup("Erreur dans l’identifiant ou le mot de passe", true);
            } else {
                // Récupération du token et redirection
                response.json().then((data) => {
                    sessionStorage.setItem("token", data.token); // STORES TOKEN
                    window.location.replace("index.html");
                }).catch((error) => {
                    // Gestion des erreurs lors de la conversion JSON
                    showPopup("Erreur lors de la récupération des données", true);
                    console.error("Erreur JSON : ", error);
                });
            }
        }).catch((error) => {
            // Affiche la popup d'erreur pour les problèmes de réseau ou serveur
            showPopup("Erreur réseau ou serveur", true);
            console.error("Erreur de connexion : ", error);
        });
    });
} else {
    console.error("Formulaire de connexion non trouvé.");
}
