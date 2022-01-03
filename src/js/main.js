// eslint-disable-next-line quotes
"use strict";

// HTML
const inputSearch = document.querySelector(".js_input");
const btnSearch = document.querySelector(".js_btnSearch");
const btnReset = document.querySelector(".js_btnReset");
const animeResults = document.querySelector(".js_animeResults");

// global variables
let data = [];
let dataFav = [];

// server request

function getAnimeResult() {
  const userValue = inputSearch.value;
  // quitar el limit de resultados
  fetch(`https://api.jikan.moe/v3/search/anime?q=${userValue}&limit=4`)
    .then((response) => response.json())
    .then((dataApi) => {
      data = dataApi.results;
      renderAnimeResult();
    });
}

// paint images
function renderAnimeResult() {
  animeResults.innerHTML = "";
  for (const eachAnime of data) {
    animeResults.innerHTML += `<li class="js_animeList">
        <img class="js_anime" data-id=${eachAnime.mal_id} src=${eachAnime.image_url} alt="Image of ${eachAnime.title}"><h3 class="js_animeTitle">${eachAnime.title}</h3>
        </li>`;
  }
  addFavAnime();
}

// get selected anime id
function addFavAnime() {
  const animeResults = document.querySelectorAll(".js_anime");
  for (const animeResult of animeResults) {
    animeResult.addEventListener("click", handleClickedAnime);
  }
}

function handleClickedAnime(ev) {
  const clickedAnimeId = parseInt(ev.currentTarget.dataset.id);
  const favAnime = data.find(
    (eachAnime) => eachAnime.mal_id === clickedAnimeId
  );
  dataFav.push({
    mal_id: favAnime.mal_id,
    image_url: favAnime.image_url,
    title: favAnime.title,
  });
  console.log(dataFav);
}

// function search
function handleSearch(ev) {
  ev.preventDefault();
  if (inputSearch.value !== "") {
    getAnimeResult();
  } else {
    animeResults.innerHTML = "<p>Introduce primero una serie :)</p>";
  }
}

// event btn search
btnSearch.addEventListener("click", handleSearch);
