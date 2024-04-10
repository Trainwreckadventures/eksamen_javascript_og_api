//based on a previous asignment, will have to alter the logic when I start testing it...
//I had such big ambitions for this, using the poke api, but after my harddrive crash I am playing it safe with things I already know

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
//fetching your punishment for loosing the game: 
async function getChuckNorrisJoke() {
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

async function getRandomFoxImage() {
    try {
        const response = await fetch(`https://randomfox.ca/floof/`);
        const data = await response.json();
        displayFoxImage(data.image);
    } catch (error) {
        console.error("Åh nei, noen har stjålet premien din!", error);
    }
}
//complimentary fox for the winner!
async function displayFoxImage(imageUrl) {
    try {
    const foxContainer = document.createElement(`div`);
    foxContainer.style.display = `flex`;
    foxContainer.style.justifyContent = `center`;
    foxContainer.style.alignItems = `center`;
    foxContainer.style.height = `60vh`; 

    const foxImage = document.createElement(`img`);
    foxImage.src = imageUrl;
    foxImage.alt = `Random Fox`;
    foxImage.style.width = `300px`;
    foxImage.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.4)";
    foxImage.style.borderRadius = "10px";

    foxContainer.appendChild(foxImage);
    document.body.appendChild(foxContainer);
} catch(error) {
console.error("bildet vil ikke laste inn", error);
}
}

const myPokemon = document.querySelectorAll(".pokemon");
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
alert(`${pokemonBoss.name} har angrepet ${randomPokemon.name} og gjort ${pokemonBoss.damage} i skade`);

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
const pokemonBossHealthTxt = document.querySelector(".pokemonboss-health-txt");
pokemonBossHealthTxt.innerHTML = `${currentBossHP}/${maxPokemonBossHP}`;

bossFaint();
}

function bossFaint () { //for when you defeat the boss
    if(pokemonBoss.currentHP <= 0) {
        const pokemonBossImage = document.querySelector(".boss");
        if(pokemonBossImage) {
            pokemonBossImage.remove();

            setTimeout(function () {
                alert("Gratulerer! Du har beseiret Totodile og vunnet spillet! Premien din er denne fine reven:");
                getRandomFoxImage();
            }, 250);
        }
    }
}

function pokemonFainted () { //for when your team gets wrecked
    if (myPokemonArray[0].currentHP <= 0) {
        let pokemonBulbasaur = document.querySelector(".img-container.bulbasaur");
        if(pokemonBulbasaur) {
            pokemonBulbasaur.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[0].name} er ute av kampen!`);
            }, 250);
        }
    }

    if (myPokemonArray[1].currentHP <= 0) {
        let pokemonSquirtle = document.querySelector(".img-container.squirtle");
        if(pokemonSquirtle) {
            pokemonSquirtle.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[1].name} er ute av kampen!`);
            }, 250);
        }
    }

    if (myPokemonArray[2].currentHP <= 0) {
        let pokemonDitto = document.querySelector(".img-container.ditto");
        if(pokemonDitto) {
            pokemonDitto.remove();
            setTimeout(function () {
                alert(`${myPokemonArray[2].name} er ute av kampen!`);
            }, 250);
        }
    }
}
//want to make the hp text react aswell....
function updatePokemonHealthBars() {

    myPokemonArray.forEach((pokemon) => {
        const healthBarContainer = document.querySelector(`.healthbar.${pokemon.name.toLowerCase()}-health`);

        if (healthBarContainer) {
           
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

function defeat () {
    const allYourPokemonFainted = myPokemonArray.filter((pokemon) => pokemon.currentHP <= 0);
    const BossStillConcious = pokemonBoss.currentHP > 0;
if(allYourPokemonFainted.length === 3 && BossStillConcious) {
    setTimeout(function () {
        alert("Du har tapt pokemon-kampen!");
        //your punishment for loosing:
        getChuckNorrisJoke();
    }, 250);
}
}
