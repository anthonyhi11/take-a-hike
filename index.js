'use strict'

const apiUrlWeatherGeoPosition = 'http://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
const apiKeyWeatherGeoPosition = 'jH9hEX2cMTEv9tR6mRQtGXRoQDAxOcZc';
const apiUrlWeather = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
const apiUrlGeocode = 'https://api.opencagedata.com/geocode/v1/json';
const apiKeyGeocode = '03e22bad1050401d963f67eaf05c9f6a';
const apiKeyTrails = '200617515-0d0fe4d295ecf7837b93fe536a715bdf';
const apiUrlTrails = 'https://www.trailrunproject.com/data/get-trails';

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
        getLocationKey(responseJson.results[0].geometry)
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


async function getLocationKey(responseJson) {
    //takes the lat and long response and get the location key to be used by the weather forecast endpoint
    let query = Object.keys(responseJson).map(response => `${responseJson[response]}`);
    let response;
    let joinedQuery = query.join(',');
    let params = {
        apikey: apiKeyWeatherGeoPosition,
        q: joinedQuery
    }
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
    let url = apiUrlWeatherGeoPosition + '?' + queryString;
    try {
        response = await fetch(url);
        let parsedResponse = await response.json();
        getWeather(parsedResponse.Key);
    } catch (error) {
        console.log(`Didn't fetch correctly`, error)
    
    } 
}


function getWeather(key) {
   //this function passes the correct url to combine with the weather api endpoint url to 
   //display the weather in the DOM
    console.log(key);
   
    let params = {
        apikey: apiKeyWeatherGeoPosition,
    }
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`);
    let url = apiUrlWeather + '/' + key + '?' + queryString;
    console.log(`url is ${url}`)
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
        <p>${responseJson.DailyForecasts[0].Day.IconPhrase}</p>
        <p>Low: ${responseJson.DailyForecasts[0].Temperature.Minimum.Value}F</p>
        <p>High: ${responseJson.DailyForecasts[0].Temperature.Maximum.Value}</p>
        <p>Summary</p>
    </li>`)
}

$(watchForm());




// STRETCH GOAL
// function listenClicks() {
//     //function listens for clicks on the description button and runs function
//     getDescription
// // 