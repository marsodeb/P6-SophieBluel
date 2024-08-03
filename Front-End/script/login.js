import { showPopup } from "./showPopup.js";

document.addEventListener("DOMContentLoaded", () => {
    const formulaireLogin = document.querySelector(".formulaire-login");
    if (!formulaireLogin) {
        console.error("Formulaire de connexion non trouvé.");
        return;
    }

    formulaireLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Récupération des valeurs des champs email et password
        const emailInput = event.target.querySelector("[name=email]");
        const passwordInput = event.target.querySelector("[name=password]");

        if (!emailInput || !passwordInput) {
            showPopup("Erreur dans le formulaire de connexion", true);
            console.error("Champs de formulaire non trouvés.");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showPopup("Veuillez remplir tous les champs", true);
            return;
        }

        const login = { email, password };

        try {
            const chargeUtile = JSON.stringify(login);

            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            });

            if (response.status !== 200) {
                throw new Error("Erreur dans l’identifiant ou le mot de passe");
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token); // Stockage du token
            window.location.replace("index.html");
        } catch (error) {
            const errorMessage = error.message || "Erreur réseau ou serveur";
            showPopup(errorMessage, true);
            console.error("Erreur de connexion : ", error);
        }
    });
});