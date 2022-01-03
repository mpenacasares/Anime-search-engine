// eslint-disable-next-line quotes
"use strict";

// HTML
const inputSearch = document.querySelector(".js_input");
const btnSearch = document.querySelector(".js_btnSearch");
const btnReset = document.querySelector(".js_btnReset");
const animeResults = document.querySelector(".js_animeResults");
const animeFav = document.querySelector(".js_animeFav");

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

// paint results
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

// get anime fav array
function handleClickedAnime(ev) {
  // get id clicked anime
  const clickedAnimeId = parseInt(ev.currentTarget.dataset.id);

  // search clicked anime in dataFav
  const favAnimeClicked = dataFav.find(
    (eachFavAnime) => eachFavAnime.mal_id === clickedAnimeId
  );

  if (favAnimeClicked === undefined) {
    // search clicked anime in data
    const favAnime = data.find(
      (eachAnime) => eachAnime.mal_id === clickedAnimeId
    );

    // add clicked anime to fav
    dataFav.push({
      mal_id: favAnime.mal_id,
      image_url: favAnime.image_url,
      title: favAnime.title,
    });
    console.log(dataFav);
    renderAnimeFavResults();
  }
  // else {
  //   console.log("Este anime ya está añadido ;)");
  // }
}

function renderAnimeFavResults() {
  animeFav.innerHTML = "";
  for (const eachFavAnime of dataFav) {
    animeFav.innerHTML += `<li class="js_animeFavList">
        <img class="js_animeFav" data-id=${eachFavAnime.mal_id} src=${eachFavAnime.image_url} alt="Image of ${eachFavAnime.title}"><h3 class="js_animeFavTitle">${eachFavAnime.title}</h3>
        </li>`;
  }
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
