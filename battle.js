//I had such big ambitions for this, using the poke api, but after my harddrive crash I am playing it safe with things I already know
//the initial idea was a card game where I would fetch random pokemon from the api for the user and the computer, the winner would be the one with the type that was strong against the other in a rock paper scissor like game
//since time wasn't on my side, I made a hardcoded version based on a previous asignment called Arbeidskrav 1 (linked in README): 

let myPokemonArray = [  
    {
        id: 0,
        name: "Bulbasaur",  
        maxHP: 40,
        currentHP: 40,
        damage: 20,
        alive: true
    },
    {
        id: 1,
        name: "Squirtle", 
        maxHP: 80, 
        currentHP: 80,
        damage: 40,
        alive: true
    },
    {
        id: 2,
        name: "Ditto",
        maxHP: 25,  
        currentHP: 25,
        damage: 10,
        alive: true
    },
];

let pokemonBoss = {
    name: "Totodile",
    maxHP: 200,
    currentHP: 200,
    damage: 20,
    alive: true,
};

async function getChuckNorrisJoke() { //fetching your punishment for loosing the game (these are so bad)
    try {
        const response = await fetch(`https://api.chucknorris.io/jokes/random`);
        const data = await response.json();
        displayJoke(data.value);
    } catch (error) {
        console.error("Oi, du slapp vist unna straffen din for denne gang", error);
    }
}

function displayJoke(joke) {
    
    alert("Du har tapt, og vil nå bli straffet med en dårlig Chuck Norris vits: " + joke);
}

async function fetchRandomPokemon() {
    try {
        const randomId = Math.floor(Math.random() * 800) + 1; // fetching you a random pokemon from the pokeapi
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("I fetchRandomPokemon var det ingen random pokemon å hente!", error);
    }
}
//should make an array to store the already won pokemon...that would be cool (maby to local or list or both).
async function randomPokemonPrice() { //you win a random pokemon from the api if you defeat Totodile!
    try {
        const randomPokemon = await fetchRandomPokemon(); //fetching you random pokemon prize
        const spriteUrl = randomPokemon.sprites.front_default;
        if (spriteUrl) { 
            const pokemonSpriteContainer = document.createElement("div"); //making a div element so I can make sure the image is nice and centered
            pokemonSpriteContainer.style.display = "flex";
            pokemonSpriteContainer.style.justifyContent = "center";
            pokemonSpriteContainer.style.alignItems = "center";
            pokemonSpriteContainer.style.height = "60vh";

            const pokemonImage = document.createElement("img"); //styling the pokepic
            pokemonImage.src = spriteUrl;
            pokemonImage.style.width = "300px";
            pokemonImage.style.borderRadius = "10px";

            pokemonSpriteContainer.appendChild(pokemonImage);
            document.body.appendChild(pokemonSpriteContainer);
        } else {
            console.error("fant ingen sprite/bilde");
        }
    } catch (error) {
        console.error("Noe gikk galt i displayPokemonSprite", error);
    }
} 

async function fetchPokemonData(pokemonName) { //getting info about the pokemon from the api:
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`klarte ikke å hente ${pokemonName} data:`, error);
        return null;
    }
}

function displayPokemonData(pokemonData) { //needed to use the api for something so in the consol log you can learn everything you need/want about these 4 pokemon
    console.log("Navn:", pokemonData.name);
    console.log("Base Stats:", pokemonData.stats);
} //I really wish I could have more time to do something more interesting with this...

const pokemonNames = ["bulbasaur", "squirtle", "ditto", "totodile"]; 

pokemonNames.forEach(async pokemonName => {
    const pokemonData = await fetchPokemonData(pokemonName);
    displayPokemonData(pokemonData);
});


const myPokemon = document.querySelectorAll(".pokemon"); //when you click the pokemon you trigger the pokemon attack
myPokemon.forEach((pokemon,i) => {
    pokemon.addEventListener("click", function () {
        pokemonAttack(i);
    });
});

function pokemonAttack(pokemonIndex) {
    const chosenPokemon = myPokemonArray[pokemonIndex];
   
    if(pokemonBoss.currentHP <= 0) {  //pokemonBoss has already fainted, return
        return;
    }
    if(chosenPokemon.currentHP <= 0) { //your pokemon has already fainted, return
        return;
    }
    //Need to fix the negative hp nuber bug...
    pokemonBoss.currentHP -= chosenPokemon.damage;
  
    alert(`${chosenPokemon.name} har gjort ${chosenPokemon.damage} skade på ${pokemonBoss.name}`);

    showPokemonBossHelth();
   
setTimeout(function () {  //boss gjør motangrep
  randomBossAttack();
}, 250);
}

function randomBossAttack() { //random attac from Totodile:
if(pokemonBoss.currentHP <= 0) {
    return; //is the boss concious?
}

const conciousPokemon = myPokemonArray.filter((pokemon) => pokemon.currentHP > 0); //filtering pokemon still responsive

if (conciousPokemon.length === 0) {
    return; //is your team defeated?
}

const randomPokemonIndex = Math.floor(Math.random() * conciousPokemon.length); //Totodile attacks at random:
const randomPokemon = conciousPokemon[randomPokemonIndex];

randomPokemon.currentHP -= pokemonBoss.damage; //The pokemonBoss deals damage:
alert(`${pokemonBoss.name} angriper ${randomPokemon.name} med Aqua Jet og gjør ${pokemonBoss.damage} i skade`);

updatePokemonHealthBars() //updating the pokemon healthbar:

if (randomPokemon.currentHP <= 0) { //did the pokemon faint?
    pokemonFainted(randomPokemon);
}
}

//pokemonBoss healthbar...
function showPokemonBossHelth() {
const currentBossHP = pokemonBoss.currentHP;
const maxPokemonBossHP = pokemonBoss.maxHP;

const pokemonBossHealthBar = document.querySelector(".pokemonboss-health");
const percentage = (currentBossHP / maxPokemonBossHP) * 100;
pokemonBossHealthBar.style.width = percentage + "%";
pokemonBoss.currentHP = Math.max(0, pokemonBoss.currentHP);
//added this: 
const pokemonBossHealthTxt = document.querySelector(".pokemonboss-health-txt"); //How to apply this logic to the other pokemon? Figure it out!
pokemonBossHealthTxt.innerHTML = `${currentBossHP}/${maxPokemonBossHP}`; //affects the hp text of the boss

if (pokemonBoss.currentHP === 0) {
    pokemonBossHealthBar.style.display = "none"; // that fixed the remaining healthbar bug
}

bossFaint();
}

 function bossFaint () { //for when you defeat the boss
    if(pokemonBoss.currentHP <= 0) {
        const pokemonBossImage = document.querySelector(".boss");
        if(pokemonBossImage) {
            pokemonBossImage.remove();

                setTimeout(function () { 
                alert("Du har beseiret Totodile og vunnet spillet! HURRA! Du vant en random pokemon!");
                 randomPokemonPrice();
            }, 250);
        }
    }
}

function pokemonFainted () { //for when your team gets wrecked...I remoove the picture and give you an alert 
    if (myPokemonArray[0].currentHP <= 0) {
        let pokemonBulbasaur = document.querySelector(".img-container.bulbasaur");
        if(pokemonBulbasaur) {
            pokemonBulbasaur.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[0].name} er bevistløs og ute av kampen!`);
            }, 250);
        }
    }

    if (myPokemonArray[1].currentHP <= 0) {
        let pokemonSquirtle = document.querySelector(".img-container.squirtle");
        if(pokemonSquirtle) {
            pokemonSquirtle.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[1].name} er bevistløs og ute av kampen!`);
            }, 250);
        }
    }

    if (myPokemonArray[2].currentHP <= 0) {
        let pokemonDitto = document.querySelector(".img-container.ditto");
        if(pokemonDitto) {
            pokemonDitto.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[2].name} er bevistløs og ute av kampen!`);
            }, 250);
        }
    }
}
// I want to make the hp text react aswell....how?!!
function updatePokemonHealthBars() { //your pokemonteams helthbars
    myPokemonArray.forEach((pokemon) => {
        const healthBarContainer = document.querySelector(`.healthbar.${pokemon.name.toLowerCase()}-health`); //finding the healthbars 

        if (healthBarContainer) { //manipulates the green healthbar (and I am still working out the kinks)
            const containerWidth = healthBarContainer.offsetWidth;
            let percentage = 0;

            if (pokemon.currentHP > 0) { 
                percentage = (pokemon.currentHP / pokemon.maxHP) * containerWidth;
            }
            healthBarContainer.style.width = percentage + "px";
         
            if (pokemon.currentHP <= 0) {
                healthBarContainer.style.width = "0px";
            }
        }
    });
    setTimeout(defeat, 250);
}

function defeat () { //function for when you loose the game
    const allYourPokemonFainted = myPokemonArray.filter((pokemon) => pokemon.currentHP <= 0); //if all your pokemon are 0 or under
    const BossStillConcious = pokemonBoss.currentHP > 0; //and boss is over 0 hp
if(allYourPokemonFainted.length === 3 && BossStillConcious) { //.lenght checks the array (3 because we have 3 pokemon) and if the boss is over 0 hp
    setTimeout(function () { //timed out the function so it doesn't happen straight away
        alert("Du har tapt pokemon-kampen!"); //alert: looser!
        getChuckNorrisJoke();   //your random punishment from the api
    }, 250);
}
}
