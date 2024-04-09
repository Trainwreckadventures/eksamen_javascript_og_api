//things to do:
// you need a default picture for the like list,
//change the name of edited pokemon in list and localStorage, make sure the color change with the new type aswell.
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
  none: "rgb(124, 215, 230)"
};

function applyCommonStyles(element) { // I used these tyles on more than one thing so I am trying to optimize
  element.style.textAlign = "center";
  element.style.fontFamily = "Courier New, Courier, monospace";
  element.style.fontWeight = "bold";
}

const buttons = document.querySelectorAll(".type-btn"); //these buttons are color coded by type:
buttons.forEach((button) => {
  const type = button.dataset.type.toLowerCase();
  const color = typeColors[type];
  button.style.backgroundColor = color;
  button.addEventListener("click", () => { //when you click the type button, it initiates the filtering
    filterPokemonByType(type);
  });
});

function filterPokemonByType(type) { //the function that filters the types:
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    const cardType = card.dataset.type.toLowerCase();
    if (type === cardType || type === "all") {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

const allTypesBtn = document.querySelector("#all-types-btn"); //button that lets you see all types that the fetch managed to get from API 
allTypesBtn.addEventListener("click", () => filterPokemonByType("all"));

function showAllTypes() {   //the function that lets you see all the types you have
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    card.style.display = "block";
  })
}

const makeYourOwnBtn = document.querySelector("#make-your-own-btn");
makeYourOwnBtn.addEventListener("click", makeYourOwnPokemon);
//needs more work!:
function makeYourOwnPokemon() {
  const myName = prompt("Skriv inn navnet på din pokemon:");
  const myType = prompt("Skriv inn typen til din pokemon:");

  if (myName && myType) {
    displayPokemon({ name: myName, types: [{ type: { name: myType } }] });
  }
}
//made an array for the pokemon:
let pokemonDataArray = [];
//fixed it so it fetches 50 and not 49 pkm:
async function fetchAndDisplayPokemon() { //fetching pokemon from the pokeapi
  try {
    let pokemonID = 0; // giving the pokemon individual id as they load
    let offset = 0; 
    const typesCount = new Map(); //keeping track of the types I have encountered
    const fetchedURL = new Set(); //keeping track of the pokemon I have loaded

    Object.keys(typeColors).forEach(type => { //keeps track of how many pokemon of each type I have
      typesCount.set(type, 0);
    });

    while (pokemonID < 50) { 
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=50&offset=${offset}` //fetching 50 pokemon, the offset is part of the pagination
      );
      const data = await response.json();
      const pokemonList = data.results;
      
        pokemonList.sort(() => Math.random() - 0.5); //making the fetch a little random

      for (const pokemon of pokemonList) { //when we reach 50 it stops
        if (pokemonID >= 50) { 
          break;
        }
        if(fetchedURL.has(pokemon.url)){ //because of the pokemonID, I have to make sure I don't fetch the same pokemon twice
          continue;
        }

        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();

        const pokemonType = pokemonData.types[0].type.name;
        // I get more out of the api if this is set to 2, but then I only get 36 pokemon so it has to be 3 as a compromise
        if (typesCount.get(pokemonType) < 3) { // making sure we get at least 3 of each type
          displayPokemon(pokemonData, pokemonID);
          pokemonID++;

          typesCount.set(pokemonType, typesCount.get(pokemonType) + 1);
          console.log("Pokemon name:", pokemonData.name);
        }
      }

      offset += 400; //starting 400 spots away from where I started in the api (pagination is usefull)
      if (offset >= data.count || pokemonID >= 50) {
        break;  //breaks the while loop
      } //I had to get chat gpt to explain the consept of pagination to me as if I was a child...
    }
    pokemonDataArray.forEach((pokemonData, index) => {
      displayPokemon(pokemonData, index);
    })
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
  const card = document.createElement("div"); //creating elements directly in js
  card.classList.add("pokemon-card");
  card.dataset.name = name.toLowerCase();
  card.dataset.type = type.toLowerCase();

  const nameElement = document.createElement("h3"); //name text
  nameElement.textContent = name;
  nameElement.style.fontSize = "24px";
  applyCommonStyles(nameElement);

  const typeElement = document.createElement("p"); //type text 
  typeElement.textContent = `Type: ${type}`;
  typeElement.style.fontSize = "16px";
  applyCommonStyles(typeElement);

  const imageElement = document.createElement("img"); //image for the card
  imageElement.src = imageUrl;
  imageElement.alt = name;
  imageElement.style.display = "block";
  imageElement.style.margin = "0 auto";
  imageElement.style.width = "250px";
  imageElement.style.height = "250px";
  imageElement.style.marginTop = "30px";
  imageElement.style.marginBottom = "50px";

  const editBtn = document.createElement("button"); //edit button:
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn", "cardBtn");
  editBtn.style.marginLeft = "40px";
  editBtn.addEventListener("click", () => {
    const card = editBtn.closest(".pokemon-card");
    const nameElement = card.querySelector("h3");
    const typeElement = card.querySelector("p");
    editPokemonData(nameElement, typeElement);
  });

  const saveBtn = document.createElement("button"); //save button:
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn", "cardBtn");
  saveBtn.style.marginLeft = "30px";
  saveBtn.addEventListener("click", () => savePokemonData(name, type)); //calling on my save function

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn", "cardBtn");
  deleteBtn.style.marginLeft = "25px";
  deleteBtn.addEventListener("click", () => deletePokemonData(name));

  card.appendChild(nameElement);  //make sure everything is appended so I can see it
  card.appendChild(typeElement); //tried to write it in shorthand but it started performing weirdly 
  card.appendChild(imageElement);
  card.appendChild(editBtn);
  card.appendChild(saveBtn);
  card.appendChild(deleteBtn);

  cardContainer.appendChild(card);

  cardContainer.style.display = "flex"; //styling for my pokemon cards
  cardContainer.style.flexDirection = "column";
  cardContainer.style.alignItems = "center";

  card.style.marginBottom = "20px"; 
  card.style.marginTop = "40px";
  card.style.position = "relative";
  card.style.width = "350px";
  card.style.height = "500px";
  card.style.borderRadius = "50px";
  card.style.backgroundColor = typeColor;
  card.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
}

async function fetchReplacementPokemon() { //Made a function that only fetches one pokemon when you delete one
  try {
const pokemonResponse = await fetch("https://pokeapi.co/api/v2/pokemon/"); //fetching a new one from api 
const data = await pokemonResponse.json();
const randomPokemon = Math.floor(Math.random() * data.count) + 1; //keeping it random 
const randomPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`;
const fetchedSinglePokemonResponse = await fetch(randomPokemonUrl);
const fetchedPokemonData = await fetchedSinglePokemonResponse.json();

pokemonDataArray.push(fetchedPokemonData); //this array stores all the fetched pokemon
displayPokemon(fetchedPokemonData); //caling display function to see it on the page

} catch (error) {
  console.error("Klarte ikke hente og vise pokemon" ,error);
}
}
//renamed constants, I'm struggeling between keeping it "professional" and how I prefer to write (how do people just know what to name anything?)
function deletePokemonData(pokemonName) { //function to delete the pokemon from page/list/localStorage
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    const updatedPokemon = savedPokemon.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem("savedPokemon", JSON.stringify(updatedPokemon)); //removes my pokemon from my localStorage
  
    const removePokemonCard = document.querySelector(`.pokemon-card[data-name="${pokemonName}"]`); 
    removePokemonCard && removePokemonCard.remove(); //removing the pokemon card
  
    const removePokemonFromList = document.getElementById("favourite-pokemon-list").querySelector(`li[data-name="${pokemonName}"]`); 
    removePokemonFromList && removePokemonFromList.remove(); //removing from list

    fetchReplacementPokemon(); //instead of calling fetchAndDisplay we call a function that only replaces the one you just deleted
  } catch (error) {
    console.error("Her gikk noe galt", error);
  }
}
//worked on this today and now there are buggs in the save function again...why?:
//need to limit what you can write in as type to...an alert or something "this type doesn't exist"
function editPokemonData(nameElement, typeElement) { //function to edit the pokemon name and type
  try {
  const newName = prompt("Skriv inn nytt navn:");
  const newType = prompt("Skriv inn ny type:");

  if (newName && newType) {
    const originalName = nameElement.textContent;
    const originalType = typeElement.textContent.replace("Type: ", "");

    nameElement.textContent = newName;
    typeElement.textContent = `Type: ${newType}`;
  
    const newTypeColor = typeColors [newType.toLowerCase()]; // at least this one works...changes the color of the card
    const card = nameElement.closest(".pokemon-card");
    card.style.backgroundColor = newTypeColor;
//these two both give me what I want but they both have buggs...
    //savePokemonData(newName, newType, true, originalName, originalType); // this lets me edit and store new names, but they stay in storage after I delete
    saveEditedPokemonData(newName, newType, originalName, originalType); //this lets me edit and store new names, but they stay in storage after I delete
  }
  } catch(error) {
console.error("noe gikk galt i edit", error);
  }
}
//Do I even need this? should just have one edit function and then save everything to savePokemonData...
function saveEditedPokemonData(originalName, originalType, newName, newType) {
  try{
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const updatedPokemon = savedPokemon.map(pokemon => {

    if (pokemon.name === originalName && pokemon.type === originalType) {
     pokemon.name = newName;
     pokemon.type = newType;
    } else {
      return pokemon;
    }
  });

  localStorage.setItem("savedPokemon", JSON.stringify(updatedPokemon));

const pokemonListItems = document.querySelectorAll(".saved-pokemon");
pokemonListItems.forEach(item => {
  if (item.dataset.name === originalName.toLowerCase()){
    item.querySelector("p").textContent = newName;
    item.dataset.name = newName.toLowerCase();
  }
});
  } catch (error) {
    console.error("klarte ikke oppdatere nytt pokemonnavn eller ny type");
  }
}

function showSavedPokemonList() { //pokemon gets added to my favourite pokemon list
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const favouriteListContainer = document.getElementById("favourite-pokemon-list");

  favouriteListContainer.innerHTML= ""; //empties the list

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
    typeElement.textContent = `Type: ${type}`;

    textContainer.appendChild(nameElement);
    textContainer.appendChild(typeElement);

    const typeColor = typeColors[type.toLowerCase()];
    listItem.style.backgroundColor = typeColor;

    listItem.appendChild(textContainer);
    favouriteListContainer.appendChild(listItem);
  });
}
//This needs alterations:
function savePokemonData(pokemonName, pokemonType) { //saving pokemon to local storage and list
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    const existingPokemon = savedPokemon.find(pokemon => pokemon.name === pokemonName && pokemon.type === pokemonType);

    if (existingPokemon) {
      alert(`${pokemonName} er allerede lagret`);
      return;
    }
//I use newName and newType in the edit function, should I implement that in here? 
    savedPokemon.push({ name: pokemonName, type: pokemonType });

    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));

    alert(`Du har lagret ${pokemonName} til "my favorite pokemon" listen og localStorage`);

    const favouriteListContainer = document.getElementById("favourite-pokemon-list");

    if (favouriteListContainer) {
      const listItem = document.createElement("li");
      listItem.textContent = `${pokemonName} - ${pokemonType}`;
      listItem.dataset.name = pokemonName.toLowerCase();
      listItem.dataset.type = pokemonType.toLowerCase();
      favouriteListContainer.appendChild(listItem);
    }

    if (savedPokemon.length >= 5) {
      alert(
        "Maksgrense er nådd, du må slette en lagret pokemon for å få plass til en ny"
      );
      return;
    }
  } catch (error) {
    console.error("Klarte ikke lagre pokemon til favorittliste eller localStorage", error);
  }
}

fetchAndDisplayPokemon();
showSavedPokemonList();


