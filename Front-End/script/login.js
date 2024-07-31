const formulaireLogin = document.querySelector(".formulaire-login");
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
            const parent = document.getElementById("login");
            const message = document.createElement("p");
            message.innerText = "Email ou mot de passe erronés";
            message.style.color = "red";
            parent.appendChild(message);
        } else {
            response.json().then((data) => {
                sessionStorage.setItem("token", data.token); //STORE TOKEN
                window.location.replace("index.html");
            });
        }
    });
});