// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


// function renderWeatherInfo(data){
//     let newpara=document.createElement('p');
//     newpara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
//     document.body.appendChild(newpara);
// }

// async function fetchWeatherDetails(){
   
//     try{

//         let city="haridwar";
    
//         const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//          const data= await response.json();
//          console.log(data);
         
//          console.log("details", data);
         
//          renderWeatherInfo(data);
//     }
//     catch(err){

//     }
// }

// async function getWeathe(){
//     try{
//         let latitude=15.6333;
//         let longitude=18.3333;
    
//         let result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         let data=await result.json();
    
//         console.log(data);
//         renderWeatherInfo(data);
//     }
//     catch(e){
//        console.log("error");
//     }
    
// }

// //geolocation
// // postman
// function loc(){
//     if(navigator.geolocation){
//         console.log("enter");
//         navigator.geolocation.getCurrentPosition(showP);
//     }
//     else{
//         console.log("Not supported");
//     }
// }

// function showP(position){
//     let lati = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log("entered");
//     console.log(lati);
//     console.log(longi);
// }


// *************************************************** start *************************************************************

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorImg=document.querySelector("[error-container]");

// initial values
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    errorImg.classList.remove("active");
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // if it is invisible then make it visible
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //to check local storage to get co-ordinates calling following function
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener("click", ()=>{
    //function call to switch tabs
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //function call to switch tabs
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    // if coordinates are not present in session Storage object
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    
    grantAccessContainer.classList.remove("active");
    
    loadingScreen.classList.add("active");
    
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
         loadingScreen.classList.remove("active");
         //home work
         //undefined means vaue is not assigned so js automaticcaly ssign value to it
         //not defoned means variable or object is not defined 
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");

    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;          //----------------- ye padho
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw
        console.log("error-------")
    }
}

function showPosition(position){

    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);


let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(searchInput.value===""){
        return;
    }

    fetchSearchWeatherInfo(searchInput.value);
});


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        errorImg.classList.remove("active")
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        // hw
        loadingScreen.classList.remove("active");
        errorImg.classList.add("active");
        // userInfoContainer.classList.remove("active");
    }
}