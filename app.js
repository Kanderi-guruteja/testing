// Function to fetch location coordinates using the provided location name
function fetchLocationCoordinates(location) {
    // Construct the geocode API URL
    const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

    // Make an AJAX request to the geocode API
    $.ajax({
        url: geocodeApiUrl,
        method: "GET",
        success: function (geocodeData) {
            const results = geocodeData;

            // Check if results are available
            if (results && results.length > 0) {
                // Extract latitude and longitude from the first result
                const firstResult = results[0];
                const latitude = firstResult.lat;
                const longitude = firstResult.lon;
                const selectedDate = $("#dateSelector").val();
                // Fetch sunrise/sunset data using obtained coordinates and selected date
                fetchSunriseSunsetData(latitude, longitude, selectedDate);
            } else {
                displayError("Location not found.");
            }
        },
        error: function (error) {
            displayError(`Geocode API Error while fetching location: ${error.responseJSON.status}`);
        },
    });
}

// Function to fetch sunrise/sunset data using latitude, longitude, and date
function fetchSunriseSunsetData(latitude, longitude, date) {
    // Convert the date to a string in the user's local time zone
    const localDateString = new Date(date).toLocaleDateString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    
    // Construct the sunrise/sunset API URL with the local date
    const sunriseSunsetApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${localDateString}`;

    // Make an AJAX request to the sunrise/sunset API
    $.ajax({
        url: sunriseSunsetApiUrl,
        method: "GET",
        success: function (data) {
            // Update the dashboard with the obtained results and selected date
            updateDashboard(data.results, date);
        },
        error: function (error) {
            displayError(`Sunrise Sunset API Error: ${error.responseJSON.status}`);
        },
    });
}
// Function to update the dashboard with sunrise/sunset results and selected date
function updateDashboard(results, selectedDate) {
    const resultElement = $("#result");
    // Format the selected date for display
    const formattedDate = new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Update the HTML content of the result element
    resultElement.html(`
        <h2>Sunrise Sunset Based on Location</h2>
        <p>Selected Date: ${formattedDate}</p>
        <p>Day of the Week: ${getDayOfWeek(selectedDate)}</p>
        <p>Sunrise: ${results.sunrise} </p>
        <p>Sunset: ${results.sunset} </p>
        <p>Dawn: ${results.dawn} </p>
        <p>Dusk: ${results.dusk} </p>
        <p>Day Length: ${results.day_length} </p>
        <p>Solar Noon: ${results.solar_noon} </p>
        <p>Time Zone: ${results.timezone} </p>
    `);
}

// Function to get the day of the week from a given date string
function getDayOfWeek(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

// Function to display an error message in the result element
function displayError(message) {
    const resultElement = $("#result");
    resultElement.html(`<p class="error-message">${message}</p>`);
}

// Event handler for the "Today" button click
$("#today").click(function () {
    // Set the date selector value to the current date
    const today = new Date().toISOString().split('T')[0];
    $("#dateSelector").val(today);
    const location = $("#locationInput").val();
    // If a location is provided, fetch and display data
    if (location) {
        fetchLocationCoordinates(location);
    }
});

// Event handler for the "Tomorrow" button click
$("#tomorrow").click(function () {
    // Set the date selector value to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISOString = tomorrow.toISOString().split('T')[0];
    $("#dateSelector").val(tomorrowISOString);
    const location = $("#locationInput").val();
    // If a location is provided, fetch and display data
    if (location) {
        fetchLocationCoordinates(location);
    }
});

// Event handler for the "Yesterday" button click
$("#yesterday").click(function () {
    // Set the date selector value to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISOString = yesterday.toISOString().split('T')[0];
    $("#dateSelector").val(yesterdayISOString);
    const location = $("#locationInput").val();
    // If a location is provided, fetch and display data
    if (location) {
        fetchLocationCoordinates(location);
    }
});

// Event handler for the "Get Current Location" button click
$("#getCurrentLocation").click(function () {
    // Get the current geolocation
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Set selectedDate to the current date
            const today = new Date().toISOString().split('T')[0];
            $("#dateSelector").val(today);

            // Fetch sunrise/sunset data with current location and date
            fetchSunriseSunsetData(latitude, longitude, today);
        },
        function (error) {
            displayError(`Geolocation Error: ${error.message}`);
        }
    );
});

// Event handler for the "Search Location" button click
$("#searchLocation").click(function () {
    // Get the location from the input field and fetch data
    const location = $("#locationInput").val();
    fetchLocationCoordinates(location);
});

// Event handler for the date selector change event
$("#dateSelector").change(function () {
    // Get the selected date and location, and fetch data
    const selectedDate = $("#dateSelector").val();
    const location = $("#locationInput").val();
    if (location) {
        fetchLocationCoordinates(location);
    }
});
