export function showPopup(message, isError = false) {
    const popup = document.querySelector(".popup");
    if (!popup) return; // Vérifiez si l'élément existe
    popup.innerText = message;
    popup.classList.add("visible");
    if (isError) {
        popup.classList.add("error");
    } else {
        popup.classList.remove("error");
    }
    setTimeout(() => {
        popup.classList.remove("visible");
    }, 3000); // Cache la popup après 3 secondes
}