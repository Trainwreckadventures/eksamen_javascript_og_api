//Things I would have done differently: optimization, smaller functions that I can reuse. Understanding the big picture before I start, understanding how these functions affect eachother.
//saving project locally, on a usb stick and to github (because my harddrive got corrupted and it affected the entire project).
//keep it simple! there is a lot of text and I would love to get better at writing shorter (including shorthand) and more functional code. 

const typeColors = {  //the 18 typecolors for the pokemon 
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

function applyCommonStyles(element) { // I used these styles on more than one thing so I am trying to optimize
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

let pokemonDataArray = []; //made an array for the fetched pokemon

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
    });
  } catch (error) {
    console.error("Noe gikk galt i fetchAndDisplayPokemon", error);
  }
}

function displayPokemon(data) { //I have done some of the styling in js
  const name = data.name;
  const type = data.types[0].type.name;
  const typeColor = typeColors[type];
  const imageUrl = data.sprites.front_default; //images from pokeapi are called sprites

  const cardContainer = document.querySelector(".card-container");
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("card-wrapper");
  
  const card = document.createElement("div"); //creating elements directly in js
  card.classList.add("pokemon-card");
  card.dataset.name = name.toLowerCase();
  card.dataset.type = type.toLowerCase();
  card.style.backgroundColor = typeColor;

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

  const makeYourOwnBtnt = document.createElement("button"); //make your own pokemon btn
  makeYourOwnBtnt.textContent = "Custom";
  makeYourOwnBtnt.classList.add("make-your-own-btn", "cardBtn");
  makeYourOwnBtnt.style.marginLeft = "30px";
  makeYourOwnBtnt.addEventListener("click", () => {
    const card = makeYourOwnBtnt.closest(".pokemon-card");
    const nameElement = card.querySelector("h3");
    const typeElement = card.querySelector("p");
    makeYourOwn(nameElement, typeElement); 
  });

  const saveBtn = document.createElement("button"); //save btn
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
  card.appendChild(makeYourOwnBtnt);
  card.appendChild(saveBtn);
  card.appendChild(deleteBtn);

  cardWrapper.appendChild(card);
  cardContainer.appendChild(cardWrapper);

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

async function fetchReplacementPokemon() { //getting 1 random pokemon from pokeapi
  try {
    const pokemonResponse = await fetch("https://pokeapi.co/api/v2/pokemon/");
    const data = await pokemonResponse.json();
    const randomPokemon = Math.floor(Math.random() * data.count) + 1;
    const randomPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${randomPokemon}`;
    const fetchedSinglePokemonResponse = await fetch(randomPokemonUrl);
    const fetchedPokemonData = await fetchedSinglePokemonResponse.json();

    pokemonDataArray.push(fetchedPokemonData);

    displayPokemon(fetchedPokemonData);

    const card = document.querySelector(`[data-name="${fetchedPokemonData.name.toLowerCase()}"]`);
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deletePokemonData(fetchedPokemonData.name));
  } catch (error) {
    console.error("Noe gikk galt i fetchReplacementPokemon", error);
  }
}


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

let defaultPokemonImg = false;
//this used to be the edit functon for the card, but I didn't know how to impliment make your own pokemon any other way, and I am running out of time!
function makeYourOwn(nameElement, typeElement) {
  try {
    const newName = prompt("Enter a new name:");
    const newType = prompt("Enter a new type:");

    if (newName && newType) {
      const originalName = nameElement.textContent;
      const originalType = typeElement.textContent.replace("Type: ", "");

      nameElement.textContent = newName;
      typeElement.textContent = `Type: ${newType}`;

      const newTypeColor = typeColors[newType.toLowerCase()];
      const card = nameElement.closest(".pokemon-card");
      card.style.backgroundColor = newTypeColor;

      savePokemonData(newName, newType, true, originalName, originalType);

      const imageElement = card.querySelector("img");

      if (!card.dataset.customized) { //manually disabled these because of the infinate save bug, if it is already customized the buttons will no longer work.
        const defaultImg = document.querySelector(".default-img");
        imageElement.src = defaultImg.src;
        card.dataset.customized = "true"; 
        const makeYourOwnBtn = card.querySelector(".make-your-own-btn");
        makeYourOwnBtn.disabled = true;
        const saveBtn = card.querySelector(".save-btn");
        saveBtn.disabled = true;

        card.dataset.name = newName.toLowerCase();
        card.dataset.type = newType.toLowerCase();

        const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deletePokemonData(newName));
      }
    }
  } catch(error) {
    console.error("Noe gikk galt i makeYourOwn funksjonen", error);
  }
}

function editPokemonListAndStorage(pokemonName, newName, newType) { //function for editing pokemon that are saved to list/storage
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  
  const index = savedPokemon.findIndex(pokemon => pokemon.name === pokemonName);
  
  if (index !== -1) {
    savedPokemon[index].name = newName;
    savedPokemon[index].type = newType;
    
    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));
    
    showSavedPokemonList();
  } else {
    console.error("Fant ikke en pokemon å edite");
  }
}

function showSavedPokemonList() { //this is what shows up in the favourite list container:
  const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const favouriteListContainer = document.getElementById("favourite-pokemon-list");

  favouriteListContainer.innerHTML = ""; //empties favourite list

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
    listItem.style.marginRight ="35px";
    
    const deleteBtn = document.createElement("button"); //delete directly from list
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("list-delete-btn");
    deleteBtn.style.marginRight = "20px"
    deleteBtn.addEventListener("click", () => {
      deletePokemonFromListAndLocal(pokemon.name);
    });
    styleButton(deleteBtn);

    const editBtn = document.createElement("button"); //edit directly in list
editBtn.textContent = "Edit";
editBtn.classList.add("list-edit-btn");
editBtn.addEventListener("click", () => {
  const newName = prompt("Enter new name:");
  const newType = prompt("Enter new type:");
  if (newName && newType) {
    editPokemonListAndStorage(pokemon.name,newName,newType);
  } else {
    console.error("Noe gikk galt i showSavedPokemonList", error);
  }
});
    styleButton(editBtn);

    listItem.appendChild(textContainer);
    listItem.appendChild(deleteBtn);
    listItem.appendChild(editBtn);
    favouriteListContainer.appendChild(listItem);
  });
}

function styleButton(button) { //look at me using a function that can apply for more than one thing...
  button.style.backgroundColor = "rgb(124, 215, 230)";
  button.style.color = "black";
  button.style.border = "none";
  button.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
  button.style.borderRadius = "5px";
  button.style.padding = "5px";
  button.style.cursor = "pointer";
  
}

//covering my base since I wasn't that smart with my code: 
function deletePokemonFromListAndLocal(pokemonName) {
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || []; 
    const updatedPokemon = savedPokemon.filter(pokemon => pokemon.name !== pokemonName);
    localStorage.setItem("savedPokemon", JSON.stringify(updatedPokemon)); // Removing Pokemon from localStorage

    const listItem = document.querySelector(`li[data-name="${pokemonName.toLowerCase()}"]`);
    listItem && listItem.remove(); // Removing from list
    showSavedPokemonList();
  } catch (error) {
    console.error("Klarte ikke slette pokemon", error);
  }
}
//now I can finally see the last favorit pokemon with styling....
function savePokemonData(pokemonName, pokemonType) {
  try {
    const savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];
    if (savedPokemon.length >= 5) {
      alert("Maksgrense er nådd, du kan ikke lagre flere pokemon.");
      return; 
    }

    const existingPokemon = savedPokemon.find(pokemon => pokemon.name === pokemonName && pokemon.type === pokemonType);

    if (existingPokemon) {
      alert(`${pokemonName} er allerede lagret`);
      return;
    }

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

    showSavedPokemonList();
  } catch (error) {
    console.error("Klarte ikke lagre pokemon til favorittliste eller localStorage", error);
  }
}


fetchAndDisplayPokemon();
showSavedPokemonList();
