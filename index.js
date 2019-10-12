'use strict'

const apiUrlEvents = '';
const apiKeyEvents = '';
const apiUrlWeather = '';
const apiKeyWeather = '';
const apiUrlGeocode = '';
const apiKeyGeocode = '';

function watchForm() {
    //this function listens on the main page and gets the user inputted data to then pass through
    // the below functions
    let city = '';
    let dateRange = '';
    getLongLat(city, dateRange);
}

function getLongLat(city, dateRange) {
    //this function formats the user info for the fetch function for the getLongLat API 
    // then passes the formatted URL through the fetch functions for getWeather and getEvents
    let formattedUrl = ''
    getEvents(formattedUrl);
    getWeather(formattedUrl);
}

function getEvents(formattedUrl) {
    //this function passes the query function through on the fetch function and handles the reponse to then
    //display results.

    displayResults(responseJson);
}
function getWeather(formattedUrl) {
    //this function passes the correct url to combine with the weather api endpoint url to 
    //display the weather in the DOM
}

function displayResults(responseJson) {
    //the manipulation of the DOM to show list of results


    listenClicks();
}

function displayWeather(responseJson) {
    //displays the weather in the DOM
}
//STRETCH GOAL
// function listenClicks() {
//     //function listens for clicks on the description button and runs function
//     getDescription
// }

