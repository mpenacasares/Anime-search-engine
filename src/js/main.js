"use strict";

// server request

let data = [];

const getDataApi = () => {
  fetch("https://api.jikan.moe/v3/search/anime?q=naruto)")
    .then((response) => response.json())
    .then((dataApi) => {
      data = dataApi.results;
      console.log(data);
    });
};

getDataApi();
