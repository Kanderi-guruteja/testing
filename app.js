// Define the functio to get geocode API
$(document).ready(function () {
 function fetchLocationCoordinates(location) {
  const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`; // Geocode API URL to search the location
//initiating the ajax request to geocode API
  $.ajax({
   url: geocodeApiUrl,
   method: "GET",
   success: function (geocodeData) {
    const results = geocodeData;
    console.log(results);//Get the response from function

    //To check if the searched location was found or not fron the user input
    if (results && results.length > 0) {
     const firstResult = results[0];
     const latitude = firstResult.lat;
     const longitude = firstResult.lon;
     //Date Selector to select the date to get the sunrise and sunset data
     const selectedDate = $("#dateSelector").val();
     //get the data using the latitude and longitude from geocode api
     fetchSunriseSunsetData(latitude, longitude, selectedDate);
    } else {
     //Exception handling
     displayError("Location not found.");
    }
   },
   error: function (error) {
    displayError(`Geocode API Error while fetching location: ${error.responseJSON.status}`);
   },
  });
 }

 function fetchSunriseSunsetData(latitude, longitude, date) {
  const sunriseSunsetApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${date}`;
//Send the ajax request to sunrisesunsetAPI
  $.ajax({
   url: sunriseSunsetApiUrl,
   method: "GET",
   success: function (data) {
    updateDashboard(data.results);
   },
   //Error handling for sunrisesunset API
   error: function (error) {
    displayError(`Sunrise Sunset API Error: ${error.responseJSON.status}`);
   },
  });
 }

 function updateDashboard(results) {
  const resultElement = $("#result");

  resultElement.html(`
   <h2>Sunrise Sunset Based on Location</h2>
   <p>Sunrise: ${results.sunrise}</p>
   <p>Sunset: ${results.sunset}</p>
   <p>Dawn: ${results.dawn}</p>
   <p>Dusk: ${results.dusk}</p>
   <p>Day Length: ${results.day_length}</p>
   <p>Solar Noon: ${results.solar_noon}</p>
   <p>Time Zone: ${results.timezone}</p>
  `);
 }

 function displayError(message) {
  const resultElement = $("#result");
  resultElement.html(`<p class="error-message">${message}</p>`);
 }

 $("#getCurrentLocation").click(function () {
  navigator.geolocation.getCurrentPosition(
   function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const selectedDate = $("#dateSelector").val();
    fetchSunriseSunsetData(latitude, longitude, selectedDate);
   },
   function (error) {
    //Eception for Geolocation
    displayError(`Geolocation Error: ${error.message}`);
   }
  );
 });

 $("#searchLocation").click(function () {
  const location = $("#locationInput").val();
  fetchLocationCoordinates(location);
 });

 $("#dateSelector").change(function () {
  const selectedDate = $("#dateSelector").val();
  const location = $("#locationInput").val();
  if (location) {
   fetchLocationCoordinates(location);
  }
 });
});
