//there is so much code, must be a way to simplyfy...
//type based color-array:
const typeColors = {
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

//Because I used this on several things:
function applyCommonStyles(element) {
  element.style.textAlign = "center";
  element.style.fontFamily = "Courier New, Courier, monospace";
  element.style.fontWeight = "bold";
}

//these buttons are color coded by type:
const buttons = document.querySelectorAll(".type-btn");
buttons.forEach((button) => {
  const type = button.dataset.type;
  const color = typeColors[type];
  button.style.backgroundColor = color;
//when you click the type button, it initiates the filtering:
  button.addEventListener("click", () => {
    const type = button.dataset.type.toLowerCase();
    console.log("Du klikket på type-knappen", type);
    filterPokemonByType(type);
  });
});
//the function that filters the types:
function filterPokemonByType(type) {
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
//Counting, since I'm only supposed to fetch 50 pokemon:
let pokeCount = 0;

//Getting the pokeAPI:
async function fetchAndDisplayPokemon() {

  try {
    //I should work more on this, must be a better way to solve it:
    const response = await fetch(
      //is it a good idea to fetc 500, I get more types, 
      //but is there an other way to solve it?:
      "https://pokeapi.co/api/v2/pokemon/?limit=500"
    );
    const data = await response.json();

    const pokemonList = data.results;
    //making sure we're random about the pokemon:
    pokemonList.sort(() => Math.random() - 0.5);
    //we start the count on 0:
    let pokeCount = 0;

    for (const pokemon of pokemonList) {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();

      displayPokemon(pokemonData);
      console.log("Pokemon navn:", pokemonData.name);
      pokeCount++;
      //this exits the loop when we reach 50 pokemon on our site:
      if (pokeCount >= 50) {
        break;
      }
    }
  } catch (error) {
    console.error("Klarte ikke hente pokemon", error);
  }
}

//normaly my pref. is to do styling in css, but I can do it in js to:
function displayPokemon(data) {
  const name = data.name;
  const type = data.types[0].type.name;
  const typeColor = typeColors[type];
  // images are called sprites in the pokeapi,
  //front_default is the one I went with, but they had others to:
  const imageUrl = data.sprites.front_default;

  const cardContainer = document.querySelector(".card-container");

  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  card.dataset.type = type.toLowerCase();

  //I can also create elements directly in js
  //name text:
  const nameElement = document.createElement("h3");
  nameElement.textContent = name;
  nameElement.style.fontSize = "24px";
  applyCommonStyles(nameElement);

  //type text:
  const typeElement = document.createElement("p");
  typeElement.textContent = `Type: ${type}`;
  typeElement.style.fontSize = "16px";
  applyCommonStyles(typeElement);

  //image:
  const imageElement = document.createElement("img");
  imageElement.src = imageUrl;
  imageElement.alt = name;
  //This was not as easy as the textAlign,
  //mental note that images needs a different approach from text:
  imageElement.style.display = "block";
  imageElement.style.margin = "0 auto";
  imageElement.style.width = "400px";
  imageElement.style.height = "400px";

  //edit button:
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn", "cardBtn");
  editBtn.style.marginLeft = "50px";
//need to add eventListner here

  //save buttonn:
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn", "cardBtn");
  saveBtn.style.marginLeft = "70px";
  //fixed this:
    saveBtn.addEventListener("click", () => savePokemonData(name, type));

  //delete button:
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn", "cardBtn");
  deleteBtn.style.marginLeft = "70px";


  //make sure everything is appended so I can see it:
  card.appendChild(nameElement);
  card.appendChild(typeElement);
  card.appendChild(imageElement);
  card.appendChild(editBtn);
  card.appendChild(saveBtn);
  card.appendChild(deleteBtn);

  cardContainer.appendChild(card);

  // nice and centered:
  cardContainer.style.display = "flex";
  cardContainer.style.flexDirection = "column";
  cardContainer.style.alignItems = "center";
  //styling for my pokemon cards:
  //need to  realign the top card with the button grid and the list if I have time:
  card.style.marginBottom = "20px";
  card.style.position = "relative";
  card.style.width = "500px";
  card.style.height = "600px";
  card.style.borderRadius = "50px";
  card.style.backgroundColor = typeColor;
  card.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.4)";
}

//delete function needs work!:
function deletePokemonData() {

}

//edit function:
function editPokemonData() {}

//getting namne/type to show up in the list, but need picture to:
function showSavedPokemonList() {
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const favouriteListContainer = document.getElementById("favourite-pokemon-list");

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

    listItem.appendChild(textContainer);

    favouriteListContainer.appendChild(listItem);
  });
}

//saving to local storage and list:
function savePokemonData(pokemonName, pokemonType, spriteURL) {
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
//Had to fix this so I don't save the same over and over:
    const existingPokemon = savedPokemon.find(pokemon => pokemon.name === pokemonName && pokemon.type === pokemonType);
    if (existingPokemon) {
      alert(`${pokemonName} er allerede lagret`);
      return;
    }
//adding pokemon to my array here:
    savedPokemon.push({ name: pokemonName, type: pokemonType, spriteURL: spriteURL });

    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));

    alert(`Du har lagret ${pokemonName} til "my favorite pokemon" listen og localStorage`);

    const favouriteListContainer = document.getElementById("favourite-pokemon-list");
    if (favouriteListContainer){
const listItem = document.createElement("li");
listItem.textContent = `${pokemonName} - ${pokemonType}`;
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

