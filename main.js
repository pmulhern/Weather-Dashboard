var city = "";
var date = moment().format('dddd, MMMM Do');
var uv = $(".uv");


$("#searchBtn").on("click", function(event) {
    event.preventDefault();    

    var city = $("#citySearch").val();
    console.log(city)

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
        var date = moment().format('M/DD/YYYY');
        var lat = response.coord.lat
        var long = response.coord.lon

        console.log(city)
        console.log(temp)
        console.log(humidity)
        console.log(windSpeed)
        console.log(lat)
        console.log(long)
        
        $("#city").empty().append(city +" (" + date + ")");
        $("#temp").empty().append(temp + String.fromCharCode(176) + "F");
        $("#humidity").empty().append(humidity + String.fromCharCode(37));
        $("#windspeed").empty().append(windSpeed + " MPH");
        $("#weatherImage").attr({"src": "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
        "height": "100px", "width":"100px"});

        localStorage.setItem("lattitude", lat)
        localStorage.setItem("longitude", long)

        let storedCity = []
        // storedCity.push(city)
        // console.log(storedCity)
        
        if(localStorage.getItem("City") === null ) 
        {
        let storedCity = [];
        storedCity.push(city);
        
        localStorage.setItem("City", storedCity)}
        else {
        let tempStoredCity = localStorage.getItem("City");

        storedCity.push(city)
        storedCity.push(tempStoredCity)

        localStorage.setItem("City", storedCity)

        } 
       

    });

    var timeDelay = 1000;           // MILLISECONDS (5 SECONDS).
    setTimeout(loadJSON, timeDelay);  // MAKE THE AJAX CALL AFTER A FEW SECONDS DELAY.

    function loadJSON() {
     
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
    
    // Must be inside the delayed function
    var uvScore = localStorage.getItem("uvScore");
    function uvColor() {
        if (uvScore <= 2){
            $("#uvIndex").addClass("low").removeClass("moderate high severe");
        } else if(uvScore > 2 && uvScore <= 5.99 ) {
            $("#uvIndex").addClass("moderate").removeClass("low high severe");
        } else if(uvScore >= 6 && uvScore <= 6.99 ) {
            $("#uvIndex").addClass("high").removeClass("low moderate severe");
        } else {
            $("#uvIndex").addClass("severe").removeClass("low moderate high");
        }
    };
    uvColor();
 

    for (let i = 0; i < 5; i++) {
        
        var temp = response2.daily[i].temp.day;
        var humidity = response2.daily[i].humidity;
        var weatherIcon = response2.daily[i].weather[0].icon

        $(`#weatherImage${i}`).attr({"src": "http://openweathermap.org/img/w/" + weatherIcon + ".png", "height": "50px", "width":"50px"});
        $(`#Temp${i}`).empty().append(temp + String.fromCharCode(176) + "F");
        $(`#Humidity${i}`).empty().append(humidity + String.fromCharCode(37));
    }

})};
});

let clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click",function() {
    window.localStorage.clear();
    location.reload();
    alert("Your tasks have been cleared")
})
