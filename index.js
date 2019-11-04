'use strict'

const apiUrlWeatherGeoPosition = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
const apiKeyWeatherGeoPosition = 'jH9hEX2cMTEv9tR6mRQtGXRoQDAxOcZc';
const apiUrlWeather = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';
const apiUrlGeocode = 'https://api.opencagedata.com/geocode/v1/json';
const apiKeyGeocode = '03e22bad1050401d963f67eaf05c9f6a';
const apiKeyTrails = '200617515-0d0fe4d295ecf7837b93fe536a715bdf';
const apiUrlTrails = 'https://www.trailrunproject.com/data/get-trails';

const STORE = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tues',
    3: 'Wed',
    4: 'Thurs',
    5: 'Fri',
    6: 'Sat'
}

function watchForm() {
    //this function listens on the main page and gets the user inputted data to then pass through
    // the below functions
    $('#js-submit').submit(function(event) {
    event.preventDefault();
    const city = $('#js-city-state').val();
    getLongLat(city);  
    });
}

function getLongLat(city) {
    //this function formats the user info for the fetch function for the getLongLat API 
    // then passes the reponse from the api through the fetch functions for getWeather and getEvents
    let encoded = encodeURI(city);
    let formatted = encoded.replace(',', '%2C');
    let params = {
        q: formatted,
        key: apiKeyGeocode,
        language: 'en',
        pretty: 1
    }

    //formatting the string to correctly call the API
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
    const geocodeUrl = apiUrlGeocode + '?' + queryString;

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
    .catch(err => {
        $('.js-results').empty();
        $('.js-results').removeClass('hidden');
        $('.js-results').append(`<h2 class='js-results'>Something went wrong: Please Enter a correct US City and State</h2>`);
 });}



function getTrails(lati, lng) {
    let params = {
        key: apiKeyTrails,
        lat: lati,
        lon: lng, 
        maxdistance: 60,
        maxresults: 15
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
    let params = {
        apikey: apiKeyWeatherGeoPosition,
    }
    let queryString = Object.keys(params).map(param => `${param}=${params[param]}`);
    let url = apiUrlWeather + '/' + key + '?' + queryString;
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
    $('.js-results').removeClass('hidden');
    $('.js-results').empty();
    for (let i=0; i<10; i++) {
    $('.js-results').append(`<li class='list-of-results'><span class='span'>
    <h3 class='event-name'>${responseJson.trails[i].name}</h3>
    <p class='length'>${responseJson.trails[i].length} miles</p>
    <img class='background-image' src='${responseJson.trails[i].imgSmall}'>
    </span>
    <p><span class='title'>${responseJson.trails[i].location}</span></p>
    <p><span class='title'>Elevation Change:</span> ${responseJson.trails[i].ascent} feet</p>
    <p><span class='title'>Summary:</span> ${responseJson.trails[i].summary}</p>
    <a href="https://www.google.com/maps/search/?api=1&query=${responseJson.trails[i].latitude},${responseJson.trails[i].longitude}" target='_blank'>Google Maps</a>
    `);
}
};

function displayWeather(responseJson) {
    //displays the weather in the DOM
    $('#weather-results').empty();
    for (let i=0; i < 5; i++) {
    let icon = responseJson.DailyForecasts[i].Day.Icon;
    let correctedIcon= icon < 10 ? '0' + icon : icon;
    let unformattedDate = responseJson.DailyForecasts[i].Date;
    let date = new Date(unformattedDate);
    let dateInt = date.getUTCDay();
    $('#weather-results').append(`
    <div class='weather-div'>
        <li class=result-weather>
            <h2>${STORE[dateInt]}</h2>
            <img src="https://developer.accuweather.com/sites/default/files/${correctedIcon}-s.png">
            <p>${responseJson.DailyForecasts[i].Day.IconPhrase}</p>
            <p>${responseJson.DailyForecasts[i].Temperature.Minimum.Value}<span>&#176;</span>/${responseJson.DailyForecasts[i].Temperature.Maximum.Value}<span>&#176;</span></p>
        </li>
    </div>`
    )
    }
}

$(watchForm());




// STRETCH GOAL
// function listenClicks() {
//     //function listens for clicks on the description button and runs function
//     getDescription
// // 
