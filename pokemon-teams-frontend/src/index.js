const BASE_URL = 'http://localhost:3000';
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener('DOMContentLoaded', () => {
  getTrainers(displayTrainers);
});

document.addEventListener('click', e => {
  if (e.target.className === 'release') {
    const { id } = e.target.dataset;
    fetch(`${POKEMONS_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    })
      .then(resp => resp.json())
      .then(data => {
        const pokemon = document.getElementById(`${data.id}`);
        pokemon.remove();
      });
  } else if (e.target.className !== 'release') {
    fetch(POKEMONS_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ trainer_id: e.target.value }),
    })
      .then(resp => resp.json())
      .then(data => {
        // console.log(data);
        const trainer = document.querySelector(`#trainer${data.trainer_id}`);
        const ul = trainer.children[2];
        renderPokemon(data, ul);
      });
  }
});

const getTrainers = callback => {
  fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(data => callback(data));
};

const displayTrainers = data => {
  data.forEach(trainer => {
    const main = document.querySelector('main');
    const { name } = trainer;
    const { pokemons } = trainer;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Pokemon';
    addButton.value = trainer.id;

    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    const div = document.createElement('div');
    pokemons.forEach(pokemon => {
      renderPokemon(pokemon, ul);
    });
    h2.textContent = name;
    div.id = `trainer${trainer.id}`;
    div.append(h2);
    div.append(addButton);
    div.append(ul);
    div.className = 'card';
    main.append(div);
  });
};

const renderPokemon = (pokemon, ul) => {
  const release = document.createElement('button');
  release.className = 'release';
  release.textContent = 'Release';
  release.setAttribute('data-id', pokemon.id);
  const li = document.createElement('li');
  li.id = pokemon.id;
  li.textContent = `${pokemon.nickname} (${pokemon.species})`;
  li.append(release);
  ul.append(li);
};
