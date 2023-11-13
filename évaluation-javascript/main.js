// Récuperation de la saisie mot de passe
const passwordInput = document.getElementById("password");

// Sélection du bouton "Actualiser"
const refreshButton = document.getElementById("refresh");

// Récupération de l'élément qui contiendra les touches 
const keyPad = document.querySelector(".keyPad");

// Fonction pour générer un nombre aléatoire
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Fonction pour créer une touche avec ou sans contenu
const createKey = (content) => {

  const key = document.createElement("div");

  key.className = `key ${content ? "fill-key" : "empty-key"}`; // Définition d'une classe CSS pour la touche selon qu'elle a un contenu ou non

  key.textContent = content || '';

  key.addEventListener("click", () => {
    passwordInput.value += key.textContent; // Ajout d'un gestionnaire d'évènement au clic pour ajouter le contenu dans le champ de mot de passe
  });

  return key;
}

// Fonction pour afficher les touches à l'écran
const displayKeys = () => {

  // Création d'un tableau avec 6 touches vides
  const keys = Array.from({ length: 6 }, () => createKey());

  // Boucle de 0 à 9 pour créer une touche avec ce nombre
  for (let i = 0; i < 10; i++) {
    keys.splice(getRandomInt(0, keys.length), 0, createKey(i));  // et l'insérer à un index aléatoire dans le tableau de touches
  }

  // Ajout de toutes les touches dans l'élément keyPad
  keys.forEach(key => keyPad.appendChild(key));

}

// Fonction pour rafraichir les touches en supprimant les touches actuelles
const refreshKeys = () => {

  while (keyPad.firstChild) {
    keyPad.removeChild(keyPad.firstChild);
  }

  displayKeys(); // et en générant de nouvelles touches  


}

// Ajout de l'événement de clic au bouton "Effacer"
refreshButton.addEventListener("click", refreshKeys);


// Validation utilisateur asynchrone

const validateUser = async (url, options) => {
  let serverMsg = document.getElementById("server-response");

  // Vérifie si l'élément avec l'id "server-response" existe 
  if (!serverMsg) {
    serverMsg = document.createElement("div");     // Crée un élément div pour afficher la réponse du serveur
    serverMsg.id = "server-response";
    document.querySelector("body").prepend(serverMsg);     // Insère l'élément div au début du body
  }

  try {
    const response = await fetch(url, options);

    // Vérifie si la réponse du serveur est OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Introduit la réponse JSON dans la console
    const data = await response.json();
    console.log(data); // Introduit la réponse JSON dans la console

    // Vérifie si la propriété 'check' existe dans la réponse JSON
    if (!data.hasOwnProperty('check')) {
      throw new Error("Property 'check' is missing in the server's response.");
    }

    serverMsg.className = "server-message";

    if (data.check === true) {
      serverMsg.textContent = "Vous êtes désormais connecté !";
    } else {
      serverMsg.textContent = "L’authentification a échoué !";
    }
  } catch (error) {
    console.error(error);
    serverMsg.textContent = error.message; // Affiche le message d'erreur dans l'élément serverMsg
  }
}

// Gestionnaire de soumission du formulaire

document.querySelector("form").addEventListener("submit", (e) => {  // Ajoute un écouteur d'événement "submit" à l'élément form 

  e.preventDefault(); // Empêche le rechargement de la page lorsque le formulaire est soumis

  // Récupération des données du formulaire
  const formData = new FormData(e.target);

  formData.append("login", e.target[0].value);
  formData.append("password", e.target[1].value);

  // Validation de l'utilisateur

  validateUser("https://www.ericfree.net/formation/api/check_user.php", {
    method: "POST",
    body: formData
  });

});

// Affichage des touches au chargement de la page

displayKeys();