const formulaireLogin = document.querySelector(".formulaireLogin");
const loginStatus = document.querySelector(".loginStatus");

formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Récupération des valeurs des champs email et password
    const emailInput = event.target.querySelector("[name=email]");
    const passwordInput = event.target.querySelector("[name=password]");

    if (!emailInput || !passwordInput) {
        console.error("Champs de formulaire non trouvés.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        loginStatus.setAttribute("style", "color:red;");
        loginStatus.innerHTML = "Vous devez remplir correctement le formulaire de connection."
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
            loginStatus.setAttribute("style", "color:red;");
            loginStatus.innerHTML = "E-mail ou mot de passe incorrect."
            return;
        }

        const data = await response.json();
        sessionStorage.setItem("token", data.token); // Stockage du token
        loginStatus.setAttribute("style", "color:#2ce62f;");
        loginStatus.innerHTML = "Vous êtes connectés, redirection dans 3 secondes..."
        setTimeout(() => {
            window.location.replace("../index.html");
        }, 2000);
    } catch (error) {
        const errorMessage = error.message || "Erreur réseau ou serveur";
        console.error("Erreur de connexion : ", error);
    }
});
