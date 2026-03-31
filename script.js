//ELEMENT
const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");
const City = document.querySelector(".city");
const Temperature = document.querySelector(".temperature");
const Condition = document.querySelector(".condition");
const Humidity = document.getElementById("humidity");
const Wind = document.getElementById("wind");
const loading = document.getElementById("loading");
const Icon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecast");

//console.log(input);
//console.log("button");

//FUNCTION AMBIL DATA DARI API / CONNECT API (REAL DATA)
async function getWeather(city) {
    const apiKey = "1a950d99464449cd9c334007263003";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4&aqi=no&alerts=no`;

    loading.style.display = "block";
    //Loading delay 1
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Kota Tidak Ditemukan !!!");
    }

    const data = await response.json();

    const firstDay = data.forecast.forecastday[0];
    //console.log(firsDay);
    
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.slice(1).forEach(day => {
    forecastContainer.innerHTML += `
        <div class="forecast-item">
        <p>${day.date}</p>
        <p>${Math.round(day.day.avgtemp_c)}°C</p>
        </div>`;
    });

    //console.log(data.forecast.forecastday);
    loading.style.display = "none";

    //ICON SESUAI KONDISI
    const icon = data.current.condition.icon;
    Icon.src = "https:" + icon;

    console.log(data);
    //ambil data ini dari API
    const cityName = data.location.name;
    const temp = data.current.temp_c;
    const condition = data.current.condition.text;
    changeBackground(condition.toLowerCase());

    const humidity = data.current.humidity;
    const wind = data.current.wind_kph;

    //test data berhasil di ambil di console
    //console.log(cityName);
    //console.log(temp);
    //console.log(condition);
    //console.log(humidity);
    //console.log(wind);

    //tampilkan data ke UI
    City.textContent = cityName;
    Temperature.textContent = Math.round(temp) + "℃";

    const formattedCondition = condition.split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)).join(" "); // Tulisan Jdi Kapital di depan
    Condition.textContent = formattedCondition;
    
    Humidity.textContent = humidity + "%";
    Wind.textContent = wind + " km/h";
}

//FUNCTION HANDLE SEARCH
function handleSearch(){
    const city = input.value.trim();

    if (!city) {
        alert("Masukkan Nama Kota !!!");
        return;
    }
    getWeather(city);
    input.value = "";
    input.focus();
}

//FUNCTION AMBIL LOKASI OTOMATIS
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeather(`${lat},${lon}`);

    }, () => {
      alert("Tidak bisa mengambil lokasi");
    });
  } else {
    alert("Geolocation tidak didukung browser");
  }
}

//FUNCTION CHANGE BACKGROUND
function changeBackground(condition) {

  const body = document.body;

  if (condition.includes("sun") || condition.includes("clear")) {
    body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
  } 
  else if (condition.includes("cloud")) {
    body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
  } 
  else if (condition.includes("rain")) {
    body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
  } 
  else {
    body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
  }

}

//EVENT KLIK BUTTON SEARCH
button.addEventListener("click", handleSearch);

//EVENT ENTER UNTUK SEARCH
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
        handleSearch();
    }
});

getUserLocation();
