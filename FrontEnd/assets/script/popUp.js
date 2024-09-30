/////////////////////////////////////////////////////
// POP UP POUR LES INFOS UTILISATEURS           /////
/////////////////////////////////////////////////////

export function showPopup(message, isError = false) {
    const popup = document.querySelector(".popupInfo");

    popup.innerText = message;
    popup.classList.add("visible");

    if (isError) {
        popup.classList.add("error");

    } else {

        popup.classList.remove("error");
    }
    setTimeout(() => {
        popup.classList.remove("visible");
    }, 3000);
}