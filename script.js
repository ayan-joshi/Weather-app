document.addEventListener("DOMContentLoaded", function () {
    const locationInput = document.getElementById("locationInput");
    const getWeatherBtn = document.getElementById("getWeatherBtn");
    const weatherDisplay = document.getElementById("weatherDisplay");
    const errorDisplay = document.getElementById("errorDisplay");
    const unitToggle = document.getElementById("unitToggle");
    const useGeolocationBtn = document.getElementById("useGeolocationBtn");

   
    const apiKey ='7b42dfa1dc05602b5d57f570f876a878';


    // Event listener for the "Get Weather" button
    getWeatherBtn.addEventListener("click", function () {
        const location = locationInput.value;
        const unit = unitToggle.value;

        if (location.trim() === "") {
            showError("Please enter a location.");
        } else {
            getWeather(location, unit);
        }
    });

    // Event listener for the "Use My Location" button
    useGeolocationBtn.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getWeatherByCoordinates(latitude, longitude);
            }, function (error) {
                showError("Geolocation error: " + error.message);
            });
        } else {
            showError("Geolocation is not supported by your browser.");
        }
    });

    // Function to fetch weather data by location
    function getWeather(location, unit) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const weatherInfo = formatWeatherData(data, unit);
                weatherDisplay.innerHTML = weatherInfo;
                errorDisplay.textContent = "";
            })
            .catch((error) => {
                showError("Weather data not found. Please check the location.");
                weatherDisplay.innerHTML = "";
            });
    }

    // Function to fetch weather data by coordinates (geolocation)
    function getWeatherByCoordinates(latitude, longitude) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const weatherInfo = formatWeatherData(data, unitToggle.value);
                weatherDisplay.innerHTML = weatherInfo;
                errorDisplay.textContent = "";
            })
            .catch((error) => {
                showError("Weather data not found. Please check your geolocation.");
                weatherDisplay.innerHTML = "";
            });
    }

    // Function to format weather data
    function formatWeatherData(data, unit) {
        const city = data.name;
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        let unitLabel = "°C";
        if (unit === "imperial") {
            unitLabel = "°F";
        }

        const weatherInfo = `
            <h2>${city}</h2>
            <p>Weather: ${description}</p>
            <p>Temperature: ${temperature.toFixed(1)} ${unitLabel}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        return weatherInfo;
    }

    // Function to display error messages
    function showError(message) {
        errorDisplay.textContent = message;
        weatherDisplay.innerHTML = "";
    }
});
