//https://api.openweathermap.org/data/2.5/weather?q=neuquen,arg&APPID=6a63e06a1099449a23c05c1759c7dc8c

//const APIKEY = "6a63e06a1099449a23c05c1759c7dc8c";
const botonBuscar = document.getElementById("buscar");
const inputBusqueda = document.getElementById("inputBusqueda");
const resultadoBusqueda = document.getElementById("resultado");
const ultimaBusqueda = document.getElementById("ultimaBusqueda");
const fondo = document.getElementById("fondo");
let resultadoHTML = "";
let map = null;

function convertidor(kelvin) {
  const celsius = kelvin - 273.15;
  return Math.floor(celsius);
}

function vientoOk(viento) {
  const vientoKm = viento * 3.6;
  return Math.floor(vientoKm);
}


const fondoImagen = { 
  "01d": "img/fondos/cielolimpio.jpg",
  "01n": "img/fondos/cielolimpionoche.jpg",
  "02d":  "img/fondos/fewclouds.jpg",
  "02n":  "img/fondos/fewcloudsnoche.jpg",
  "03d":  "img/fondos/scatteredclouds.jpg",
  "03n":  "img/fondos/scatteredcloudsnoche.jpg",
  "04d":  "img/fondos/brokenclouds.jpg",
  "04n":  "img/fondos/brokenclouds.jpg",
  "09d":  "img/fondos/showerrain.jpg",
  "09n":  "img/fondos/showerrain.jpg",
  "10d":  "img/fondos/rain.jpg",
  "10n":  "img/fondos/rain.jpg",
  "11d":  "img/fondos/thunderstorm.jpg",
  "11n":  "img/fondos/thunderstorm.jpg",
  "13d":  "img/fondos/snow.jpg",
  "13n":  "img/fondos/snownoche.jpg",
  "50d":  "img/fondos/mist.jpg",
  "50n":  "img/fondos/mistnoche.jpg"

}

//aparezca la ultima busqueda
window.addEventListener("DOMContentLoaded", () => {
  const ultimaBusquedaValue = localStorage.getItem("ultimaBusqueda");
  const anteultimaBusquedaValue = localStorage.getItem("anteultimaBusqueda");

  if (ultimaBusquedaValue && anteultimaBusquedaValue) {
    inputBusqueda.value = ultimaBusquedaValue;
    ultimaBusqueda.innerHTML = `Anterior búsqueda: ${anteultimaBusquedaValue}`;
  } else if (ultimaBusquedaValue) {
    inputBusqueda.value = ultimaBusquedaValue;
  }
});
botonBuscar.addEventListener("click", (event) => {
  event.preventDefault();
  console.log(`Buscaste ${inputBusqueda.value}`);
  const ultimaBusquedaValue = localStorage.getItem("ultimaBusqueda");
  localStorage.setItem("anteultimaBusqueda", ultimaBusquedaValue);
  localStorage.setItem("ultimaBusqueda", inputBusqueda.value);

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputBusqueda.value}&APPID=6a63e06a1099449a23c05c1759c7dc8c`
  )
    .then((respuesta) => {
      console.log(`primer then responde ${respuesta}`, respuesta);
      return respuesta.json();
    })
    .then((json) => {
      console.log("json crudo:", json);

      const lugar = json.name; // Obteern el nombre del lugar del JSON
      //obtener clima del json y con la funcion pasarla a celsius
      const climaKelvin = json.main.temp;
      const climaCelcius = convertidor(climaKelvin);

      const tempMin = json.main.temp_min;
      const tempMinC = convertidor(tempMin);

      const tempMax = json.main.temp_max;
      const tempMaxC = convertidor(tempMax);

      const sensacionT = json.main.feels_like;
      const sensacionTC = convertidor(sensacionT);

      const humedad = json.main.humidity;
      const presionAtmosferica = json.main.pressure;

      const viento = json.wind.speed;
      const vientoBien = vientoOk(viento);
      //Obtener el icono
      const weather = json.weather[0];
      const codigoIcono = weather.icon;
      console.log(codigoIcono);

      const iconoUrl = `https://openweathermap.org/img/wn/${codigoIcono}@2x.png`;

      const descripcionClima = weather.description;

      const anteultimaBusquedaValue =
        localStorage.getItem("anteultimaBusqueda");

      //const coordenadas = json.coord[0];
      const longitud = json.coord.lon;
      const latitud = json.coord.lat;

      try {
        if (map) {
          map.remove(); // Eliminar el mapa previo
        }
        map = L.map("mapa").setView([latitud, longitud], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
      } catch (error) {
        console.log(error);
      }

      if (codigoIcono in fondoImagen) {
        const rutaImagen = fondoImagen[codigoIcono]; // Obtener la ruta de la imagen correspondiente al código de icono
        fondo.style.backgroundImage = `url(${rutaImagen})`; // Asignar la imagen de fondo al div
      } else {
        // Código de icono no encontrado en el mapeo, puedes asignar una imagen por defecto o manejarlo de otra manera
       //miDiv.style.backgroundImage = 'url(ruta_a_la_imagen_por_defecto.jpg)';
      console.log(codigoIcono)
      }




      let resultadoHTML = `


      <h2 class="col-12 m-3 d-flex justify-content-center">${lugar}</h2>

      <div class="col-lg-6 col-sm-12 d-flex align-items-center p-1  justify-content-end ">
      <img class="col-lg-3 col-sm-6 img-fluid icono" src="${iconoUrl}" alt="${descripcionClima}">
      <h2 class="col-lg-3 col-sm-6 fs-1">${climaCelcius}°</h2></div>

      <div class="col-lg-6 col-sm-12 d-flex align-items-center justify-content-start " >
       <div class="col-lg-3 col-sm-6 d-flex p-1  align-items-start justify-content-center">
      <img src=img/iconos/tmax.png class="iconochico img-fluid">
      <p >${tempMaxC}°</p></div>
      <div class="col-lg-3 col-sm-6 d-flex p-1  align-items-start justify-content-center ">
      <img src=img/iconos/tmin.png class="iconochico img-fluid">
      <p >${tempMinC}°</p></div>
     </div>
      <div class="col-lg-6 col-sm-12 d-flex p-1  align-items-start justify-content-center borde-card">
      <img src=img/iconos/humedad.png class="iconochico img-fluid">
      <p>Humedad ${humedad}%</p></div>
      <div class="col-lg-6 col-sm-12 d-flex p-1  align-items-start justify-content-center borde-card">
      <img src=img/iconos/sensacion.png class="iconochico img-fluid">
      <p>Sensacion Termica: ${sensacionTC}°</p></div>
      <div class="col-lg-6 col-sm-12 d-flex p-1  align-items-start justify-content-center borde-card">
      <img src=img/iconos/presion.png class="iconochico img-fluid p-1">
      <p>Presion Atmosferica: ${presionAtmosferica}</p></div>
      <div class="col-lg-6 col-sm-12 d-flex p-1  align-items-start justify-content-center borde-card">
      <img src=img/iconos/viento.png class="iconochico img-fluid p-1">
      <p>Viento: ${vientoBien}Km/h</p></div>
      
      <p class="col-lg-6 col-sm-12 p-1 d-flex align-items-start justify-content-center">Anterior búsqueda: ${anteultimaBusquedaValue}</p>
    `;

      resultadoBusqueda.innerHTML = resultadoHTML;
    })

    .catch((err) => {
      console.log(`Hubo un error: ${err}`);
    })
    .finally((final) => {
      // borra el loading
      console.log("ejecuto el finally");
    });
});
