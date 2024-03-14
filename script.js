// Declare variables to store latitude and longitude
let latitude;
let longitude;

// Function to fetch local weather data using latitude and longitude
const getLocalWeather = async (latitude, longitude) => {
    try {
        // Fetch weather data from API using latitude and longitude
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=precipitation_probability_max&timezone=auto`);
        if (response.ok) {
            // If response is successful, parse the data and process it
            const data = await response.json();
            processWeatherData(data);
        } else {
            // If response is not successful, log the error
            console.error('Error:', response.status);
        }
    } catch (error) {
        // If an error occurs during the fetch, log the error
        console.error('Error:', error);
    }
};

// Function to process weather data
const processWeatherData = (data) => {
    // Extract necessary data from the response
    const latitude = data.latitude;
    const longitude = data.longitude;
    const currentTemperature = data.current.temperature_2m;
    const currentWeatherCode = data.current.weather_code;
    const todayPrecipitationProbability = data.daily.precipitation_probability_max[0];

    // Log the extracted data
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Current Temperature:', currentTemperature);
    console.log('Current Weather Code:', currentWeatherCode);
    console.log('Today Precipitation Probability:', todayPrecipitationProbability);
    
    // Update the UI with the weather data
    document.getElementById("card").style.display = "block";
    document.getElementById('current-temperature').innerHTML = String(currentTemperature) + "ºC";
    getWeatherIcon(currentWeatherCode);
    document.getElementById('chance-of-rain').innerHTML = String(todayPrecipitationProbability) + "%";
};

// Function to get weather icon based on weather code
const getWeatherIcon = (weatherCode) => {
    // Get the current time
    const currentTime = new Date().getHours();
    // Check if it is day time
    const isDayTime = currentTime >= 6 && currentTime < 18;

    // Fetch the weather icons data
    fetch('./icons.json')
        .then(response => response.json())
        .then(iconsData => {
            // Get the weather icon based on weather code and day/night time
            const weatherIcon = iconsData[weatherCode]?.[isDayTime ? 'day' : 'night']?.image;
            if (weatherIcon) {
                // If weather icon is found, update the UI with the icon
                console.log('Weather Icon:', weatherIcon);
                document.getElementById('weather-icon').src = weatherIcon;
            } else {
                // If weather icon is not found, log the error
                console.error('Weather Icon not found for weather code:', weatherCode);
            }
        })
        .catch(error => {
            // If an error occurs during the fetch, log the error
            console.error('Error:', error);
        });
};

// Event listener to get coordinates from IP when the DOM is loaded
window.addEventListener('DOMContentLoaded', getLocalWeather(22.28552, 114.15769));

// Function to change the location and fetch weather data for the new location
const changeLocation = () => {
    let location = document.getElementById('location').value;
    console.log(location)
    let newLatitude = 0;
    let newLongitude = 0;

    // Check the selected location and assign corresponding latitude and longitude values
    if (location === 'hongkong') {
        newLatitude = 22.28552;
        newLongitude = 114.15769;
    } else if (location === 'london') {
        newLatitude = 51.5074;
        newLongitude = -0.1278;
    } else if (location === 'newyork') {
        newLatitude = 40.7128;
        newLongitude = -74.0060;
    } 

    // Call the getLocalWeather function with the new latitude and longitude
    getLocalWeather(newLatitude, newLongitude);
}

