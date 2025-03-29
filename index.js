const BASE_URL = "https://my-app-backend-6dtd.onrender.com/cities";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherContainer = document.getElementById("weather-container");
const forecastContainer = document.getElementById("forecast-container");
const background = document.body;
const addCityButton = document.getElementById("add-city-button");
const updateCityButton = document.getElementById("update-city-button");

async function fetchWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}?name=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if (data.length > 0) {
            displayWeather(data[0]);
        } else {
            weatherContainer.innerHTML = `<p>City not found. Try again.</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherContainer.innerHTML = `<p>Error fetching data. Check connection.</p>`;
    }
}

function displayWeather(weatherData) {
    const { id, name, temperature, windSpeed, condition, forecast } = weatherData;
    weatherContainer.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
        <p><strong>Condition:</strong> ${condition}</p>
        <button onclick="deleteCity('${id}')">Delete City</button>
    `;
    updateBackground(condition);
    displayForecast(forecast);
}

function displayForecast(forecast) {
    forecastContainer.innerHTML = `<h2>5-Day Forecast</h2>`;
    forecastContainer.innerHTML += forecast.map(day => `
        <div class="forecast-day">
            <p><strong>${day.date}</strong></p>
            <p>${day.temperature}°C</p>
            <p>${day.condition}</p>
        </div>
    `).join('');
}

function updateBackground(condition) {
    const backgrounds = {
        "Sunny": "url('images/clear.jpg')",
        "Rainy": "url('images/rain.jpg')",
        "Cloudy": "url('images/cloudy.jpg')",
        "Snowy": "url('images/snow.jpg')"
    };
    background.style.backgroundImage = backgrounds[condition] || "url('images/default.jpg')";
}

async function addCity(city, temperature, windSpeed, condition, forecast) {
    const newCity = { name: city, temperature, windSpeed, condition, forecast };
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCity)
        });
        if (response.ok) {
            const addedCity = await response.json();
            alert("City added successfully!");
            displayWeather(addedCity);
        } else {
            alert("Failed to add city.");
        }
    } catch (error) {
        console.error("Error adding city:", error);
    }
}

async function updateCity(id, updatedData) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        if (response.ok) {
            alert("City weather updated successfully!");
        } else {
            alert("Failed to update city.");
        }
    } catch (error) {
        console.error("Error updating city:", error);
    }
}

async function deleteCity(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            alert("City deleted successfully!");
            weatherContainer.innerHTML = "";
            forecastContainer.innerHTML = "";
        } else {
            alert("Failed to delete city. Check if the city exists.");
        }
    } catch (error) {
        console.error("Error deleting city:", error);
    }
}

searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
});

addCityButton.addEventListener("click", () => {
    const city = prompt("Enter city name:");
    const temperature = prompt("Enter temperature (°C):");
    const windSpeed = prompt("Enter wind speed (km/h):");
    const condition = prompt("Enter weather condition:");
    
    if (!city || !temperature || !windSpeed || !condition) {
        alert("All fields are required!");
        return;
    }

    const forecast = [];
    for (let i = 1; i <= 5; i++) {
        const dayTemp = prompt(`Enter temperature for Day ${i} (°C):`);
        const dayCondition = prompt(`Enter condition for Day ${i}:`);
        forecast.push({ date: `Day ${i}`, temperature: dayTemp, condition: dayCondition });
    }

    addCity(city, temperature, windSpeed, condition, forecast);
});

updateCityButton.addEventListener("click", () => {
    const cityId = prompt("Enter city ID to update:");
    if (!cityId) return;

    const temperature = prompt("Enter new temperature (°C):");
    const windSpeed = prompt("Enter new wind speed (km/h):");
    const condition = prompt("Enter new weather condition:");

    const updatedData = {};
    if (temperature) updatedData.temperature = temperature;
    if (windSpeed) updatedData.windSpeed = windSpeed;
    if (condition) updatedData.condition = condition;

    if (Object.keys(updatedData).length > 0) {
        updateCity(cityId, updatedData);
    }
});

fetchWeather("New York");
