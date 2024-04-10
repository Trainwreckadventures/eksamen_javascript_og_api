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
        maxHP: 20,  
        currentHP: 20,
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

//pokemonBoss healthbar...needs different logic based on the css!
function showPokemonBossHelth() {
const currentBossHP = pokemonBoss.currentHP;
const maxPokemonBossHP = pokemonBoss.maxHP;

const pokemonBossHealthBar = document.querySelector(".pokemonboss-health");
const percentage = (currentBossHP / maxPokemonBossHP) * 100;
pokemonBossHealthBar.style.width = percentage + "%";
pokemonBoss.currentHP = Math.max(0, pokemonBoss.currentHP);

bossFaint();
}

function bossFaint () { //for when you defeat the boss
    if(pokemonBoss.currentHP <= 0) {
        const pokemonBossImage = document.querySelector(".boss");
        if(pokemonBossImage) {
            let pokemonBossTotodile = document.querySelector(".img-container.boss-container");
            
            pokemonBossImage.remove();

            setTimeout(function () {
                alert("Gratulerer! Du har beseiret Totodile og vunnet spillet!");
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
    }, 250);
}
}