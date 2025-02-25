const formSubmit = document.getElementById("submit-form");
const userInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");
const imageContainer = document.querySelector(".sprite-container");
const tags = document.querySelector(".tags");

const cleanUserInput = (input) => {
    return input.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

const getPokemon = async () => {
    try {
        const query = cleanUserInput(userInput.value);
        if (!query) {
            alert("Please enter a Pokémon name or ID");
            return;
        }

        const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${query}`);
        if (!res.ok) throw new Error("Pokémon not found");

        const data = await res.json();

        // Set Pokémon info
        pokemonName.textContent = data.name.toUpperCase();
        pokemonId.textContent = data.id;
        pokemonWeight.textContent = data.weight;
        pokemonHeight.textContent = data.height;
        
        // Set Pokémon image
        imageContainer.innerHTML = `<img src="${data.sprites.front_default}" alt="${data.name}" />`;

        // Set table stats
        hp.textContent = data.stats[0].base_stat;
        attack.textContent = data.stats[1].base_stat;
        defense.textContent = data.stats[2].base_stat;
        specialAttack.textContent = data.stats[3].base_stat;
        specialDefense.textContent = data.stats[4].base_stat;
        speed.textContent = data.stats[5].base_stat;

        // Set types (tags)
        tags.innerHTML = data.types
            .map(type => `<span class="tag">${type.type.name.toUpperCase()}</span>`)
            .join('');

    } catch (err) {
        alert("Pokémon not found");
        resetDisplay();
    }
};

const resetDisplay = () => {
    pokemonName.textContent = "";
    pokemonId.textContent = "";
    pokemonWeight.textContent = "";
    pokemonHeight.textContent = "";
    imageContainer.innerHTML = "";
    hp.textContent = "";
    attack.textContent = "";
    defense.textContent = "";
    specialAttack.textContent = "";
    specialDefense.textContent = "";
    speed.textContent = "";
    tags.innerHTML = "";
};

formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    getPokemon();
});
