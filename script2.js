// GLOBAL VARIABLES
var city = "";
var date = moment().format('dddd, MMMM Do');
var uv = $(".uv");
var pullHistory = localStorage.getItem("City")
var citiesSearched = JSON.parse(pullHistory)
console.log(citiesSearched)

// SETTING LAST CITY SEARCHED
if(citiesSearched === null){
    lastCity = null} else {
    lastCity = citiesSearched[citiesSearched.length-1]
    forecast(lastCity);
    renderPrevSearch()
}  

// CLICK EVENT TO INIT AJAX AND SET LOCAL STORAGE
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var city = $("#citySearch").val();
    forecast(city);
    setStorage();    
})

// CURRENT FORECAST WHICH ALSO PULLS LONG/ LAT TO INIT SECOND AJX CALL FOR 5 DAY FORECAST
function forecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=cd805afbcca4574c470ae7a3e6fa7c0b&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        var city = response.name
        var temp = response.main.temp
        var humidity = response.main.humidity
        var windSpeed = response.wind.speed
        var weatherDate = response.dt
        var lat = response.coord.lat
        var long = response.coord.lon
        var weatherDate = response.dt
        var correctedDate = new Date(weatherDate * 1000)
        var correctedDate2 = moment(correctedDate).format('M/DD/YYYY')
        
        $("#city").empty().append(city +" (" + correctedDate2 + ")");
        $("#temp").empty().append(temp + String.fromCharCode(176) + "F");
        $("#humidity").empty().append(humidity + String.fromCharCode(37));
        $("#windspeed").empty().append(windSpeed + " MPH");
        $("#weatherImage").attr({"src": "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
        "height": "100px", "width":"100px"});

        localStorage.setItem("lattitude", lat)
        localStorage.setItem("longitude", long)

        fiveDayForecast();
})};

// FIVE DAY FORECAST FUNCTION
    function fiveDayForecast() {
    

    var lat = localStorage.getItem("lattitude", lat)
    var long = localStorage.getItem("longitude", long)
    console.log(lat)
    console.log(long)

    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + long +"&exclude=hourly,minutely&appid=cd805afbcca4574c470ae7a3e6fa7c0b&units=imperial";
    $.ajax({
        url: queryURL2,
        method: "GET",
    }).then(function(response2) {
        console.log(response2)
    
    var uvIndex = response2.current.uvi
    console.log(uvIndex)
    localStorage.setItem("uvScore", uvIndex)
    $("#uvIndex").empty().append(uvIndex);

    for (let i = 1; i < 6; i++) {
        
        var temp = response2.daily[i].temp.day;
        var humidity = response2.daily[i].humidity;
        var weatherIcon = response2.daily[i].weather[0].icon
        var weatherDate = response2.daily[i].dt
        var correctedDate = new Date(weatherDate * 1000)
        var correctedDate2 = moment(correctedDate).format('M/DD/YYYY')

        $(`#Date${i}`).empty().append(correctedDate2);
        $(`#weatherImage${i}`).attr({"src": "http://openweathermap.org/img/w/" + weatherIcon + ".png", "height": "50px", "width":"50px"});
        $(`#Temp${i}`).empty().append(temp + String.fromCharCode(176) + "F");
        $(`#Humidity${i}`).empty().append(humidity + String.fromCharCode(37));

        var uvScore = localStorage.getItem("uvScore");
        if (uvScore <= 2){
            $("#uvIndex").addClass("low").removeClass("moderate high severe");
        } else if(uvScore > 2 && uvScore <= 5.99 ) {
            $("#uvIndex").addClass("moderate").removeClass("low high severe");
        } else if(uvScore >= 6 && uvScore <= 6.99 ) {
            $("#uvIndex").addClass("high").removeClass("low moderate severe");
        } else {
            $("#uvIndex").addClass("severe").removeClass("low moderate high");
        }
    }
})};

// SETTING LOCAL STORAGE FUNCTION
function setStorage() {

    if(localStorage.getItem("City") === null ) 
        {
        let city = $("#citySearch").val()
        let storedCity = [];
        storedCity.push(city);
        console.log(storedCity);
        
        localStorage.setItem("City", JSON.stringify(storedCity))
        } else {
        let city = $("#citySearch").val()

        let retrievedCity = localStorage.getItem("City")
        let storedCity2 = JSON.parse(retrievedCity);
        if (storedCity2.indexOf(city)===-1) {

        
        storedCity2.push(city);
        localStorage.setItem("City", JSON.stringify(storedCity2))}
    
        }
      
        renderPrevSearch();
        }
      
// DISPLAYS HISTORICAL SEARCHES
function renderPrevSearch() {
    
    let storage = localStorage.getItem("City");
    let prevCities = JSON.parse(storage)

            $("#buttons-view").empty();
        
        for (let i = 0; i < prevCities.length; i++) {
            
              var a = $("<button>");
              a.addClass("searches");
              a.attr("data-name", prevCities[i]);
              a.attr("onclick", prevCities[i]);
              console.log("data-name")
              a.text(prevCities[i]);
              $("#buttons-view").prepend(a);
            
            }
}

// SWITCH FORECAST TO PREVIOUS SEARCH
$(document).on("click", ".searches", function(event){
    event.preventDefault();    

    if ($(this).attr("id") === "searchBtn") {
        city = $("#citySearch").val();
    } else{ 
        city = $(this).text();
    }
    forecast(city);

    });  

// CLEAR LOCAL STORAGE
let clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click",function() {
    window.localStorage.clear();
    location.reload();
    alert("Your tasks have been cleared")
});

// End JS Code
