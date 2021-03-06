// Load the 'dot.env' package.
require('dotenv').config();

const fetch = require('node-fetch');

// Reading in the .env key value.
// See: https://thecatapi.com/
const KEY = process.env.CAT_API_KEY;

module.exports = async function () {
    let breedUrl = 'https://api.thecatapi.com/v1/breeds?limit=5' + '&api_key=' + KEY;
    let resp = await fetch(breedUrl);
    let data = await resp.json();
    // console.log(data);
    return data;
};
