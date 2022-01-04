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
  fetch(`https://api.jikan.moe/v3/search/anime?q=${userValue}`)
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
    // Check previous fav anime in dataFav
    const selectedFavAnime = dataFav.findIndex(
      (favedAnime) => favedAnime.mal_id === eachAnime.mal_id
    );

    if (selectedFavAnime !== -1) {
      animeResults.innerHTML += `<li class="js_animeList favourite" data-id=${eachAnime.mal_id}>
        <img class="js_anime" data-id=${eachAnime.mal_id} src=${eachAnime.image_url} alt="Image of ${eachAnime.title}"><h3 class="js_animeTitle">${eachAnime.title}</h3>
        </li>`;
    } else {
      animeResults.innerHTML += `<li class="js_animeList resultLi" data-id=${eachAnime.mal_id}>
      <img class="js_anime" data-id=${eachAnime.mal_id} src=${eachAnime.image_url} alt="Image of ${eachAnime.title}"><h3 class="js_animeTitle">${eachAnime.title}</h3>
      </li>`;
    }
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
    // add class to selected anime
    ev.target.parentNode.classList.add("favourite");

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
  } else {
    ev.target.parentNode.classList.remove("favourite");
    const removeFavAnimeIndex = dataFav.indexOf(favAnimeClicked);
    dataFav.splice(removeFavAnimeIndex, 1);
  }
  renderAnimeFavResults();
  setInLocalStorage();
}

function renderAnimeFavResults() {
  animeFav.innerHTML = "";
  for (const eachFavAnime of dataFav) {
    animeFav.innerHTML += `<li class="js_animeFavList animeFavList" data-id=${eachFavAnime.mal_id}>
        <img class="js_animeFav" src=${eachFavAnime.image_url} alt="Image of ${eachFavAnime.title}"><h3 class="js_animeFavTitle">${eachFavAnime.title}</h3><button class="js_BtnResetFav btnX">X</button>
        </li>`;
  }
  removeFavAnime();
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

// local Storage

const getFromLocalStorage = () => {
  const localStoragedataFav = localStorage.getItem("dataFav");
  if (localStoragedataFav !== null) {
    dataFav = JSON.parse(localStoragedataFav);
    renderAnimeFavResults();
  }
};

const setInLocalStorage = () => {
  const stringifydataFav = JSON.stringify(dataFav);
  localStorage.setItem("dataFav", stringifydataFav);
};

// event btn search
btnSearch.addEventListener("click", handleSearch);

// start app
getFromLocalStorage();

// BONUS-------------------------------------------------------------------------------------------------

// clean dataFAV & localStorage // no need to clean up the results

function handleReset(ev) {
  ev.preventDefault();
  inputSearch.value = "";
  dataFav = [];
  renderAnimeFavResults();
  localStorage.removeItem("dataFav");
  renderAnimeResult();
}

// event btn reset
btnReset.addEventListener("click", handleReset);

// event btn resetFav

function removeFavAnime() {
  const allBtnReset = document.querySelectorAll(".js_BtnResetFav");
  for (const eachFavAnime of allBtnReset) {
    eachFavAnime.addEventListener("click", handleRemoveFav);
  }
}

// remove selected object
function handleRemoveFav(ev) {
  // select li id
  const clickedRemoveAnimeId = parseInt(
    ev.currentTarget.parentElement.dataset.id
  );

  // find id anime at dataFav
  const findAnime = dataFav.find(
    (eachAnime) => eachAnime.mal_id === clickedRemoveAnimeId
  );

  // find id position (number) to reset selected anime at dataFav
  const findAnimeIndex = dataFav.indexOf(findAnime);

  // remove selected anime at dataFav
  dataFav.splice(findAnimeIndex, 1);

  setInLocalStorage();
  renderAnimeFavResults();
  renderAnimeResult();
}
