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

//Because I used this on two things:
function applyCommonStyles(element) {
  element.style.textAlign = "center";
  element.style.fontFamily = "Courier New, Courier, monospace";
  element.style.fontWeight = "bold";
}

//these buttons are colorcoded by type:
const buttons = document.querySelectorAll(".type-btn");
buttons.forEach((button) => {
  const type = button.dataset.type;
  const color = typeColors[type];
  button.style.backgroundColor = color;
  //still working out how to get all the buttons to work:
  button.addEventListener("click", () => {
    const type = button.dataset.type.toLowerCase();
    console.log("Clicked type:", type);
    filterPokemonByType(type);
  });
});
//this needs more work, some of the cards show up with pokemon, but not all:
function filterPokemonByType(type) {
  const cards = document.querySelectorAll(".pokemon-card");
  cards.forEach((card) => {
    //throwing in a toLowercase() hoping it will fix my filter isshues, nope, did not...
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
    //I should probably fix this so it fetches at least one of each type and not the same pokemon twice:
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=50");
    const data = await response.json();

    const pokemonList = data.results;

    // desperate act to make it a little more random:
    pokemonList.sort(() => Math.random() - 0.5);
    //we start the count on 0:
    let pokeCount = 0;

    for (const pokemon of pokemonList) {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();

      displayPokemon(pokemonData);
      console.log("Pokemon name:", pokemonData.name);
      pokeCount++;
      //this exits the loop when we reach 50:
      if (pokeCount >= 50) {
        break;
      }
    }
  } catch (error) {
    console.error("Failed to fetch pokemon", error);
  }
}

//normaly my pref is to do styling in css, but I can do it in js to:
function displayPokemon(data) {
  const name = data.name;
  const type = data.types[0].type.name;
  const typeColor = typeColors[type];
  // images are called sprites in th epokeapi,
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

  //make sure everything is appended so I can see it:
  card.appendChild(nameElement);
  card.appendChild(typeElement);
  card.appendChild(imageElement);

  cardContainer.appendChild(card);

  //nice and centered:
  cardContainer.style.display = "flex";
  cardContainer.style.justifyContent = "center";
  cardContainer.style.alignItems = "flex-end";
  //Here I'm styling the card:
  card.style.position = "absolute";
  card.style.top = "20%";
  card.style.width = "500px";
  card.style.height = "600px";
  card.style.borderRadius = "50px";
  card.style.backgroundColor = typeColor;
  //this part looks weird when the page loads, why?:
  card.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.4)";
}

//I am calling on the fetchAndDisplay function:
fetchAndDisplayPokemon();
