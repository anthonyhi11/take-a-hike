'use strict'

const apiUrlWeather = 'https://cors-anywhere.herokuapp.com/https://www.amdoren.com/api/weather.php';
const apiKeyWeather = 'JGvtUEzvrEiNXHqBhzdHUFbg2LDSa2';
const apiUrlGeocode = 'https://api.opencagedata.com/geocode/v1/json';
const apiKeyGeocode = '03e22bad1050401d963f67eaf05c9f6a';
const apiKeyTrails = '200617515-0d0fe4d295ecf7837b93fe536a715bdf'
const apiUrlTrails = 'https://www.trailrunproject.com/data/get-trails'

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
}

function getLongLat(city, date) {
    //this function formats the user info for the fetch function for the getLongLat API 
    // then passes the reponse from the api through the fetch functions for getWeather and getEvents
    let encoded = encodeURI(city);
    let formatted = encoded.replace(',', '%2C')
    console.log(formatted)
    let params = {
        q: formatted,
        key: apiKeyGeocode,
        language: 'en',
        pretty: 1
    }

    //formatting the string to correctly call the API
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
    console.log(queryString);
    const geocodeUrl = apiUrlGeocode + '?' + queryString

    //fetch function
    fetch(geocodeUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => { //passing the values through the weather and events api
        getWeather(responseJson.results[0].geometry, date)
        getTrails(responseJson.results[0].geometry.lat, responseJson.results[0].geometry.lng)
    })
    .catch(err => {console.log(`Something went wrong: ${err.message}`);
 });}



function getTrails(lati, lng) {
    console.log(lati);
    console.log(lng);
    let params = {
        key: apiKeyTrails,
        lat: lati,
        lon: lng
    }
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
    let url = apiUrlTrails + '?' + queryString;
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        displayResults(responseJson);
    });
}

function getWeather(latLng, date) {
   //this function passes the correct url to combine with the weather api endpoint url to 
   //display the weather in the DOM
    console.log(latLng);
    console.log(`getWeather date is ${date}`);
    let eventLat = latLng.lat;
    let eventLon = latLng.lng;
    let weatherParams = {
        api_key: apiKeyWeather,
        lat: eventLat,
        lon: eventLon
    }
    let queryString = Object.keys(weatherParams).map(param =>`${param}=${weatherParams[param]}`).join('&');
    let url = apiUrlWeather + '?' + queryString;
    console.log(url); 

    fetch(url).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayWeather(responseJson))
      .catch(err => {console.log(`Something went wrong getting weather: ${err.message}`);
      });
    }

function displayResults(responseJson) {
    //the manipulation of the DOM to show list of results
    for (let i=0; i<10; i++) {
    $('#js-results').append(`<li class='list-of-results'>
    <h1 class='event-name'>${responseJson.trails[i].name}</h1>
    <p>${responseJson.trails[i].location}</p>
    <p>Summary: ${responseJson.trails[i].summary}</p>
    <a href='${responseJson.trails[i].url}'<p class='event-url' target='_blank'>Visit Site</p></a>
    `) } }

function displayWeather(responseJson) {
    //displays the weather in the DOM
    $('#weather-results').append(`
    <li class=result-weather>
        <p>${responseJson.forecast[0].date}</p>
        <p>Low: ${responseJson.forecast[0].min_f}</p>
        <p>High: ${responseJson.forecast[0].max_f}</p>
        <p>Summary: ${responseJson.forecast[0].summary}</p
//     </li>`)
}

$(watchForm());









// function getEvents(latLng, date) {
//     //this function passes the query function through on the fetch function and handles the reponse to then
//    //display results.
//     console.log(`getEvents latLng = ${latLng}`);
//     console.log(`getEvents date is ${date}`);
//     let correctLatLon = Object.keys(latLng).map(value => `${latLng[value]}`).join(',');
//     let correctDate = date + 'T00:00:00Z' //adding formatting for the API
//     let endDate = date + 'T23:59:59Z';
//     let params = {
//         apikey: apiKeyEvents,
//         latlong: correctLatLon,
//         startDateTime: correctDate,
//         endDateTime: endDate,
//         radius: 50
//     }
//     let queryString = Object.keys(params).map(param =>
//         `${param}=${params[param]}`).join('&');
//         let url = apiUrlEvents + '?' + queryString;
//         console.log(`the url for getEvents is ${url}`)

//     fetch(url)
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error(response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson));
//  }




// STRETCH GOAL
// function listenClicks() {
//     //function listens for clicks on the description button and runs function
//     getDescription
// // 