//=================================================
//                    ELEMENT
//=================================================
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
const errorMsg = document.getElementById("errorMsg");

//=================================================
//                    API (DATA)
//=================================================

//    ==== AMBIL DATA DARI API / CONNECT API (REAL DATA) ====
async function getWeather(city) {
  // 1. VALIDASI INPUT
  if (!city) {
    showError("masukkan Nama Kota!");
    return;
  }

  // 2. SET API
    const apiKey = "1a950d99464449cd9c334007263003";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=4&aqi=no&alerts=no`;

  try {
    // 3. LOADING ON
    showLoading();

    // 4. FETCH
    const response = await fetch(url);

    // 5. HANDLE ERROR API
    if (!response.ok) {
      throw new Error("Kota tidak ditemukan!");
    }

    // 6. AMBIL DATA
    const data = await response.json();

    updateUI(data);

  } catch (error) {
    showError(error.message); //menampilkan error
  }
}

//=================================================
//                    UI
//=================================================
//    ==== UPDATE UI ====
function updateUI(data) {

  errorMsg.style.display = "none"; //hide error message saat sukses
  loading.style.display = "none"; //sembunyikan loading saat sukses

    // FORECAST
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.slice(1).forEach(day => {
      const date = new Date(day.date);
      const formattedDate = date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short"
      });
      forecastContainer.innerHTML += `
        <div class="forecast-item">
          <p>${formattedDate}</p>
          <p>${Math.round(day.day.avgtemp_c)}°C</p>
        </div>
      `;
    });

    // ICON
    const icon = data.current.condition.icon;
    Icon.src = "https:" + icon;
    Icon.alt = "Weather Icon";

    // DATA UTAMA
    const cityName = data.location.name;
    const formattedCity = cityName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

    const temp = data.current.temp_c;
    const condition = data.current.condition.text;
    const humidity = data.current.humidity;
    const wind = data.current.wind_kph;

    // FORMAT TEXT
    const formattedCondition = condition
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // UPDATE UI
    City.textContent = formattedCity;
    Temperature.textContent = Math.round(temp) + "℃";
    Condition.textContent = formattedCondition;
    Humidity.textContent = `${humidity}%`;
    Wind.textContent = `${Math.round(wind)} km/h`;

    // BACKGROUND
    changeBackground(condition.toLowerCase());
}

//    ==== SHOW ERROR ====
function showError(message) {
    errorMsg.innerText = message;
    errorMsg.style.display = "block";

    //sembunyikan data
    City.textContent = "_ _";
    Temperature.textContent = "_ _";
    Condition.textContent = "_ _";
    Humidity.textContent = "_ _";
    Wind.textContent = "_ _";
    Icon.src = "";
    forecastContainer.innerHTML = "";
}

//    ==== UI SAAT LOADING ====
function showLoading() {
    loading.style.display = "block";

    //sembunyikan ui
    City.textContent = "";
    Temperature.textContent = "";
    Condition.textContent = "";
    Humidity.textContent = "";
    Wind.textContent = "";
    Icon.src = "";
    forecastContainer.innerHTML = "";
}

//    ==== CHANGE BACKGROUND ====
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

//=================================================
//                    HANDLER
//=================================================
//    ==== HANDLE SEARCH ====
function handleSearch(){
    const city = input.value.trim();
    getWeather(city);
    input.value = "";
    input.focus();
}

//    ==== AMBIL LOKASI OTOMATIS ====
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

//=================================================
//                    EVENT
//=================================================
//    ==== SEARCH ====
button.addEventListener("click", handleSearch);

//    ==== ENTER SEARCH ====
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter"){
        handleSearch();
    }
});

//=================================================
//                    INIT
//=================================================
getUserLocation();
