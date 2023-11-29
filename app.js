$(document).ready(function () {
    function fetchLocationCoordinates(location) {
        const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

        $.ajax({
            url: geocodeApiUrl,
            method: "GET",
            success: function (geocodeData) {
                const results = geocodeData;

                if (results && results.length > 0) {
                    const firstResult = results[0];
                    const latitude = firstResult.lat;
                    const longitude = firstResult.lon;
                    const selectedDate = $("#dateSelector").val();
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

    function fetchSunriseSunsetData(latitude, longitude, date) {
        const sunriseSunsetApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${date}`;

        $.ajax({
            url: sunriseSunsetApiUrl,
            method: "GET",
            success: function (data) {
                updateDashboard(data.results, date);
            },
            error: function (error) {
                displayError(`Sunrise Sunset API Error: ${error.responseJSON.status}`);
            },
        });
    }

    function updateDashboard(results, selectedDate) {
        const resultElement = $("#result");
        const formattedDate = new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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

    function getDayOfWeek(dateString) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    }

    function displayError(message) {
        const resultElement = $("#result");
        resultElement.html(`<p class="error-message">${message}</p>`);
    }

    $("#today").click(function () {
        const today = new Date().toISOString().split('T')[0];
        $("#dateSelector").val(today);
        const location = $("#locationInput").val();
        if (location) {
            fetchLocationCoordinates(location);
        }
    });

    $("#tomorrow").click(function () {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowISOString = tomorrow.toISOString().split('T')[0];
        $("#dateSelector").val(tomorrowISOString);
        const location = $("#locationInput").val();
        if (location) {
            fetchLocationCoordinates(location);
        }
    });

    $("#yesterday").click(function () {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISOString = yesterday.toISOString().split('T')[0];
        $("#dateSelector").val(yesterdayISOString);
        const location = $("#locationInput").val();
        if (location) {
            fetchLocationCoordinates(location);
        }
    });

    $("#getCurrentLocation").click(function () {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const selectedDate = $("#dateSelector").val();
                fetchSunriseSunsetData(latitude, longitude, selectedDate);
            },
            function (error) {
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
