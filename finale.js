
const app = document.querySelector('.weatheria');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const bgVideo = document.getElementById('bg-video');

let cityInput = "Tokyo";


cities.forEach(city => {
  city.addEventListener('click', e => {
    cityInput = e.target.innerHTML;
    fetchWeatherData();
    app.style.opacity = "0";
  });
});


form.addEventListener('submit', e => {
  e.preventDefault();
  if (search.value.length === 0) {
    alert('Please type a city name');
  } else {
    cityInput = search.value;
    fetchWeatherData();
    search.value = "";
    app.style.opacity = "0";
  }
});


function dayOfTheWeek(day, month, year) {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return weekday[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}


function fetchWeatherData() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=221afbfb6d733ac2a3e8537c8f784753&units=metric`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      
      temp.innerHTML = Math.round(data.main.temp) + "&#176;";
      conditionOutput.innerHTML = data.weather[0].description;

      
      const utcMillis = data.dt * 1000;              
      const timezoneMillis = data.timezone * 1000;   
      const cityDate = new Date(utcMillis + timezoneMillis);

      const y = cityDate.getUTCFullYear();
      const m = cityDate.getUTCMonth() + 1;
      const d = cityDate.getUTCDate();
      const hours = cityDate.getUTCHours();
      const minutes = cityDate.getUTCMinutes();

     
      const t = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;

      dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)}, ${d}-${m}-${y}`;
      timeOutput.innerHTML = t;
     

      nameOutput.innerHTML = data.name;
      const iconCode = data.weather[0].icon;
      icon.onerror = () => { icon.src = "./images/clear.png"; }; 
      icon.src =' https://openweathermap.org/img/wn/${iconCode}@2x.png';



     
      cloudOutput.innerHTML = data.clouds.all + "%";
      humidityOutput.innerHTML = data.main.humidity + "%";
      windOutput.innerHTML = Math.round(data.wind.speed) + " km/h";

      
      let timeOfDay = (hours >= 18 || hours < 6) ? "night" : "day";
      const code = data.weather[0].id;

     
      let videoPath = "videos/clear-day.mp4"; 
      if(code === 800) videoPath = `videos/clear-${timeOfDay}.mp4`;
      else if(code >= 801 && code <= 804) videoPath = `videos/cloudy-${timeOfDay}.mp4`;
      else if(code >= 500 && code <= 531) videoPath = `videos/rainy-${timeOfDay}.mp4`;
      else if(code >= 600 && code <= 622) videoPath = `videos/snowy-${timeOfDay}.mp4`;
      else videoPath = `videos/clear-${timeOfDay}.mp4`;

      bgVideo.src = videoPath;
      bgVideo.load();
      bgVideo.play();

      
      btn.style.background = (timeOfDay==="night") ? "#181e27" :
                             (code===800) ? "#e5ba92" :
                             (code>=801 && code<=804) ? "#fa6d1b" :
                             (code>=500 && code<=531) ? "#647d75" : "#4d72aa";

     
      app.style.opacity = "1";
    })
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}


fetchWeatherData();
app.style.opacity = "1";
