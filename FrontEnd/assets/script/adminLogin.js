import { showPopup } from "./popUp.js";

const formulaireLogin = document.querySelector(".formulaireLogin");


formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = event.target.querySelector("[name=email]");
    const passwordInput = event.target.querySelector("[name=password]");
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        showPopup("Merci de remplir correctement le formulaire de connection.", true);
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
            showPopup("E-mail ou mot de passe incorrect.", true);
            return;
        }

        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        window.location.replace("../index.html");
    } catch (error) {
        showPopup("Erreur réseau.", true);
    }
});
