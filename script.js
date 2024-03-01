let latitude;
let longitude;

const getLocalWeather = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=precipitation_probability_max&timezone=auto`);
        if (response.ok) {
            const data = await response.json();
            processWeatherData(data);
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const getCoordinatesFromIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            const ipAddress = data.ip;
            const scraperResponse = await fetch(`https://scraper.run/ip?addr=${ipAddress}`);
            if (scraperResponse.ok) {
                const scraperData = await scraperResponse.json();
                document.getElementById("location").innerHTML = scraperData.city + ", " + scraperData.country;
                latitude = scraperData.latitude;
                longitude = scraperData.longitude;
                getLocalWeather(latitude, longitude);
            } else {
                console.error('Error:', scraperResponse.status);
            }
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const processWeatherData = (data) => {
    const latitude = data.latitude;
    const longitude = data.longitude;
    const currentTemperature = data.current.temperature_2m;
    const currentWeatherCode = data.current.weather_code;
    const todayPrecipitationProbability = data.daily.precipitation_probability_max[0];

    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Current Temperature:', currentTemperature);
    console.log('Current Weather Code:', currentWeatherCode);
    console.log('Today Precipitation Probability:', todayPrecipitationProbability);
    
    document.getElementById("card").style.display = "block";
    document.getElementById('current-temperature').innerHTML = String(currentTemperature) + "ºC";
    getWeatherIcon(currentWeatherCode);
    document.getElementById('chance-of-rain').innerHTML = String(todayPrecipitationProbability) + "%";
    
};


const getWeatherIcon = (weatherCode) => {
    const currentTime = new Date().getHours();
    const isDayTime = currentTime >= 6 && currentTime < 18;

    fetch('./icons.json')
        .then(response => response.json())
        .then(iconsData => {
            const weatherIcon = iconsData[weatherCode]?.[isDayTime ? 'day' : 'night']?.image;
            if (weatherIcon) {
                console.log('Weather Icon:', weatherIcon);
                document.getElementById('weather-icon').src = weatherIcon;
            } else {
                console.error('Weather Icon not found for weather code:', weatherCode);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// 
window.addEventListener('DOMContentLoaded', getCoordinatesFromIP);

