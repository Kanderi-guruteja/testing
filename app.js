// Define the function to fetch location coordinates from the geocode API
function fetchLocationCoordinates(location) {
  // Construct the geocode API URL
  const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

  // Send an AJAX request to the geocode API
  $.ajax({
    url: geocodeApiUrl,
    method: "GET",
    success: function (geocodeData) {
      // Store the response data
      const results = geocodeData;

      // Log the response data to the console
      console.log(results);

      // Check if any results were found
      if (results && results.length > 0) {
        // Extract the latitude and longitude from the first result
        const firstResult = results[0];
        const latitude = firstResult.lat;
        const longitude = firstResult.lon;

        // Get the selected date from the date selector
        const selectedDate = $("#dateSelector").val();

        // Fetch sunrise and sunset data using the latitude, longitude, and selected date
        fetchSunriseSunsetData(latitude, longitude, selectedDate);
      } else {
        // Display an error message if no location was found
        displayError("Location not found.");
      }
    },
    error: function (error) {
      // Handle errors from the geocode API
      displayError(`Geocode API Error: <span class="math-inline">\{error\.responseJSON\.status\}\`\);
\}
\}\);
\}
// Define the function to fetch sunrise and sunset data from the sunrise\-sunset API
function fetchSunriseSunsetData\(latitude, longitude, date\) \{
// Construct the sunrise\-sunset API URL
const sunriseSunsetApiUrl \= \`https\://api\.sunrisesunset\.io/json?lat\=</span>{latitude}&lng=<span class="math-inline">\{longitude\}&formatted\=0&date\=</span>{date}`;

  // Send an AJAX request to the sunrise-sunset API
  $.ajax({
    url: sunriseSunsetApiUrl,
    method: "GET",
    success: function (data) {
      // Store the response data
      const results = data.results;

      // Update the dashboard with the sunrise and sunset data
      updateDashboard(results);
    },
    error: function (error) {
      // Handle errors from the sunrise-sunset API
      displayError(`Sunrise Sunset API Error: ${error.responseJSON.status}`);
    }
  });
}

// Define the function to update the dashboard with sunrise and sunset data
function updateDashboard(results) {
  // Get the HTML element for the result area
  const resultElement = $("#result");

  // Clear the existing content of the result area
  resultElement.html("");

  // Dynamically generate HTML content based on the sunrise and sunset data
  resultElement.append(`
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

// Define the function to display error messages
function displayError(message) {
  // Get the HTML element for the result area
  const resultElement = <span class="math-inline">\("\#result"\);
// Clear the existing content of the result area
resultElement\.html\(""\);
// Append an error message to the result area
resultElement\.append\(\`<p class\="error\-message"\></span>{message}</p>`);
}

// Handle click event on the "Use Current Location" button
$("#getCurrentLocation").click(function () {
  // Get the current user's location using the Geolocation API
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Extract the latitude and longitude from the position object
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Get the selected date from the date selector
      const selectedDate = $("#dateSelector").val();

      // Fetch sunrise and sunset data using the current location and selected date
      fetchSunriseSunsetData(latitude, longitude, selectedDate);
    },
    function (error) {
      // Handle errors from the Geolocation API
      displayError(`Geolocation Error: ${error.message}`);
    }
  );
});

