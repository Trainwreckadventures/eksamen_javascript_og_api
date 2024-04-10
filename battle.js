//based on previous asignment, will have to alter the logic when I start testing it...
//I had such big ambitions for this, using the poke api, but after my harddrive crash I am playing it safe with things I already know
let myPokemonArray = [
    {
        id: 0,
        name: "Bulbasaur",  
        currentHP: 40,
        damage: 20,
        alive: true
    },
    {
        id: 1,
        name: "Squirtle",  
        currentHP: 80,
        damage: 40,
        alive: true
    },
    {
        id: 2,
        name: "Ditto",  
        currentHP: 20,
        damage: 10,
        alive: true
    },
];

let pokemonBoss = {
    name: "Totodile",
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

//pokemonBoss healthbar:
function showPokemonBossHelth() {

}