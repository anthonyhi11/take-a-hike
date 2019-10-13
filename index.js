'use strict'

const apiUrlEvents = '';
const apiKeyEvents = '';
const apiUrlWeather = '';
const apiKeyWeather = '';
const apiUrlGeocode = 'https://api.opencagedata.com/geocode/v1/json';
const apiKeyGeocode = '03e22bad1050401d963f67eaf05c9f6a';

function watchForm() {
    //this function listens on the main page and gets the user inputted data to then pass through
    // the below functions
    $('#js-submit').submit(function(event) {
    event.preventDefault();
    const city = $('#js-city-state').val();
    const date = $('#js-start').val();
    console.log(city);
    console.log(date);
    getLongLat(city, date);  
    });
    console.log("hey now");
}

function getLongLat(city, date) {
    //this function formats the user info for the fetch function for the getLongLat API 
    // then passes the formatted URL through the fetch functions for getWeather and getEvents
    let encoded = encodeURI(city);
    let formatted = encoded.replace(',', '%2C')
    console.log(formatted)
    let params = {
        q: formatted,
        key: apiKeyGeocode,
        language: 'en',
        pretty: 1
    }
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
    console.log(queryString);
    const geocodeUrl = apiUrlGeocode + '?' + queryString
    fetch(geocodeUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getWeather(responseJson.results[0].geometry, date))
    //.then(responseJson => getEvents(responseJson.results[0].geometry, date))
    .catch(err => {console.log(`Something went wrong: ${err.message}`);

//     getEvents(formatted);
//     getWeather(formatted);
 });}

function getEvents(latLng, date) {
    //this function passes the query function through on the fetch function and handles the reponse to then
   //display results.
    console.log(`getEvents latLng = ${latLng}`);
    console.log(`getEvents date is ${date}`);
     //displayResults(responseJson);
 }
function getWeather(latLng, date) {
    //this function passes the correct url to combine with the weather api endpoint url to 
   //display the weather in the DOM
    console.log(`getWeather latLng is ${latLng}`);
    console.log(`getWeather date is ${date}`);

 }

// function displayResults(responseJson) {
//     //the manipulation of the DOM to show list of results


//     listenClicks();
// }

// function displayWeather(responseJson) {
//     //displays the weather in the DOM
// }
//STRETCH GOAL
// function listenClicks() {
//     //function listens for clicks on the description button and runs function
//     getDescription
// }

$(watchForm());

