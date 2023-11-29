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
            <table>
                <tr>
                    <th>Selected Date</th>
                    <th>Day of the Week</th>
                    <th>Sunrise</th>
                    <th>Sunset</th>
                    <th>Dawn</th>
                    <th>Dusk</th>
                    <th>Day Length</th>
                    <th>Solar Noon</th>
                    <th>Time Zone</th>
                </tr>
                <tr>
                    <td>${formattedDate}</td>
                    <td>${getDayOfWeek(selectedDate)}</td>
                    <td>${results.sunrise}</td>
                    <td>${results.sunset}</td>
                    <td>${results.dawn}</td>
                    <td>${results.dusk}</td>
                    <td>${results.day_length}</td>
                    <td>${results.solar_noon}</td>
                    <td>${results.timezone}</td>
                </tr>
            </table>
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

    // Event handlers
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

    // Dropdown handling
    $(".dropbtn").click(function () {
        $(".dropdown-content").toggleClass("show");
    });

    $(".dropdown-content a").click(function () {
        const relativeDate = $(this).text().toLowerCase();
        let selectedDate = new Date();

        if (relativeDate === "today") {
            selectedDate = new Date();
        } else if (relativeDate === "tomorrow") {
            selectedDate.setDate(selectedDate.getDate() + 1);
        } else if (relativeDate === "yesterday") {
            selectedDate.setDate(selectedDate.getDate() - 1);
        }

        $("#dateSelector").val(selectedDate.toISOString().split("T")[0]);
        const location = $("#locationInput").val();
        if (location) {
            fetchLocationCoordinates(location);
        }

        // Hide the dropdown after selecting a relative date
        $(".dropdown-content").removeClass("show");
    });

    // Close the dropdown if the user clicks outside of it
    $(window).click(function (e) {
        if (!e.target.matches('.dropbtn')) {
            const dropdownContent = $(".dropdown-content");
            if (dropdownContent.hasClass('show')) {
                dropdownContent.removeClass('show');
            }
        }
    });
});
