const typeColors = { //type based color-array:
  bug: "rgb(148, 188, 74)",
  dark: "rgb(115, 108, 117)",
  dragon: "rgb(106, 123, 175)",
  electric: "rgb(229, 197, 49)",
  fairy: "rgb(227, 151, 209)",
  fighting: "rgb(203, 95, 72)",
  fire: "rgb(234, 122, 60)",
  flying: "rgb(125, 166, 222)",
  ghost: "rgb(132, 106, 182)",
  grass: "rgb(113, 197, 88)",
  ground: "rgb(204, 159, 79)",
  ice: "rgb(112, 203, 212)",
  normal: "rgb(170, 176, 159)",
  poison: "rgb(180, 104, 183)",
  psychic: "rgb(229, 112, 155)",
  rock: "rgb(178, 160, 97)",
  steel: "rgb(137, 161, 176)",
  water: "rgb(83, 154, 226)",
};

function applyCommonStyles(element) { // I used these tyles on more than one thing so I am trying to optimize
  element.style.textAlign = "center";
  element.style.fontFamily = "Courier New, Courier, monospace";
  element.style.fontWeight = "bold";
}

const buttons = document.querySelectorAll(".type-btn"); //these buttons are color coded by type:
buttons.forEach((button) => {
  const type = button.dataset.type;
  const color = typeColors[type];
  button.style.backgroundColor = color;
  button.addEventListener("click", () => { //when you click the type button, it initiates the filtering
    const type = button.dataset.type.toLowerCase();
    filterPokemonByType(type);
  });
});

function filterPokemonByType(type) { //the function that filters the types:
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    const cardType = card.dataset.type.toLowerCase();
    console.log("Type:", type, "Card type:", cardType);
    if (type === cardType) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

const allTypesBtn = document.querySelector("#all-types-btn"); //made a button so you can see all types 

function showAllTypes() {  
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    card.style.display = "block";
  })
}

allTypesBtn.addEventListener("click", showAllTypes); //calling the function for all types

let pokemonID = 0;

async function fetchAndDisplayPokemon() { //Getting the pokeAPI:
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?limit=500" //getting pokemon from the API
    );

    const data = await response.json();
    const pokemonList = data.results;

    pokemonList.sort(() => Math.random() - 0.5); //making sure we're random about the pokemon:

    for (const pokemon of pokemonList) {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();

      displayPokemon(pokemonData, pokemonID);
      pokemonID++;
      console.log("Pokemon navn:", pokemonData.name);

      if (pokemonID >= 50) { //this exits the loop when we reach 50 pokemon on our site
        break;
      }
    }
  } catch (error) {

    console.error("Klarte ikke hente pokemon", error);
  }
}

function displayPokemon(data) { //normaly my pref. is to do styling in css, but I wanted to have a go at styling in js to

  const name = data.name;
  const type = data.types[0].type.name;
  const typeColor = typeColors[type];
  const imageUrl = data.sprites.front_default; //images are called sprites in the pokeapi, and they have multiple images to choose from

  const cardContainer = document.querySelector(".card-container");

  const card = document.createElement("div");
  card.classList.add("pokemon-card");
  card.dataset.type =data.types[0].type.name.toLowerCase();

  const nameElement = document.createElement("h3"); //creating elements directly in js

  nameElement.textContent = name; //name text
  nameElement.style.fontSize = "24px";
  applyCommonStyles(nameElement);

  const typeElement = document.createElement("p");  //type text 
  typeElement.textContent = `Type: ${type}`;
  typeElement.style.fontSize = "16px";
  applyCommonStyles(typeElement);

  const imageElement = document.createElement("img");  //image for the card
  imageElement.src = imageUrl;
  imageElement.alt = name;
  imageElement.style.display = "block"; 
  imageElement.style.margin = "0 auto";
  imageElement.style.width = "250px";
  imageElement.style.height = "250px";
  imageElement.style.marginTop = "30px";
  imageElement.style.marginBottom = "50px";


  const editBtn = document.createElement("button");  //edit button:
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn", "cardBtn");
  editBtn.style.marginLeft = "40px";
//need to add eventListner here

  const saveBtn = document.createElement("button");  //save button:
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn", "cardBtn");
  saveBtn.style.marginLeft = "30px";
  saveBtn.addEventListener("click", () => savePokemonData(name, type)); //calling on my save function

  const deleteBtn = document.createElement("button");  //delete button:
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn", "cardBtn");
  deleteBtn.style.marginLeft = "25px";
  deleteBtn.addEventListener("click", () => deletePokemonData(card.dataset.id)); //calling on my delete function

  card.appendChild(nameElement);  //make sure everything is appended so I can see it
  card.appendChild(typeElement);
  card.appendChild(imageElement);
  card.appendChild(editBtn);
  card.appendChild(saveBtn);
  card.appendChild(deleteBtn);

  cardContainer.appendChild(card);

  cardContainer.style.display = "flex";
  cardContainer.style.flexDirection = "column";
  cardContainer.style.alignItems = "center";

  card.style.marginBottom = "20px";  //styling for my pokemon cards
  card.style.marginTop = "40px";
  card.style.position = "relative";
  card.style.width = "350px";
  card.style.height = "500px";
  card.style.borderRadius = "50px";
  card.style.backgroundColor = typeColor;
  card.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
}

function deletePokemonData(pokemonID) { 
  try {
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || []; 
  const updatedPokemon = savedPokemon.filter(pokemon => pokemon.id !== pokemonID);
  localStorage.setItem("savedPokemon", JSON.stringify(updatedPokemon));

  const listItemToRemove = document.getElementById("favourite-pokemon-list").querySelector(`li[data-id="${pokemonID}"]`);
  listItemToRemove && listItemToRemove.remove(); //removing pokemon from the list and the storage

  //can't get the picture to go away, why? 
} catch (error) {
  console.error("Her gikk noe galt", error);
}
}

function editPokemonData() { //edit function:

}

function showSavedPokemonList() { //pokemon gets added to my favourite pokemon list
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const favouriteListContainer = document.getElementById("favourite-pokemon-list");

  //favouriteListContainer.innerHTML= "";

  savedPokemon.forEach((pokemon) => {
  const name = pokemon.name;
  const type = pokemon.type;

  const listItem = document.createElement("li");
  listItem.classList.add("saved-pokemon");

  const textContainer = document.createElement("div");
 textContainer.classList.add("pokemon-info");

  const nameElement = document.createElement("p");
  nameElement.textContent = name;

  const typeElement = document.createElement("p");
  typeElement.textContent = type;

textContainer.appendChild(nameElement);
textContainer.appendChild(typeElement);

favouriteListContainer.appendChild(listItem);
  });
}

function savePokemonData(pokemonName, pokemonType, pokemonID) { //saving pokemon to local storage and list
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    const existingPokemon = savedPokemon.find(pokemon => pokemon.name === pokemonName && pokemon.type === pokemonType);

    if (existingPokemon) {
      alert(`${pokemonName} er allerede lagret`);
      return;
    }

    savedPokemon.push({ name: pokemonName, type: pokemonType}); 

    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));

    alert(`Du har lagret ${pokemonName} til "my favorite pokemon" listen og localStorage`);

    const favouriteListContainer = document.getElementById("favourite-pokemon-list");

    if (favouriteListContainer){
     const listItem = document.createElement("li");
     listItem.textContent = `${pokemonName} - ${pokemonType}`;
     listItem.dataset.id = pokemonID;
     favouriteListContainer.appendChild(listItem);
    }

    if (savedPokemon.length >= 5) {
      alert(
        "Maksgrense er nådd, du må slette en lagret pokemon for å få plass til en ny"
      );
      return;
    }
  } catch (error) {
    console.error("Klarte ikke lagre pokemon til dine favoritter localStorage", error);
  }
}

fetchAndDisplayPokemon();
showSavedPokemonList();

