var city = "";
var date = moment().format('dddd, MMMM Do');
var uvScore = localStorage.getItem("uvScore")
var uv = $(".uv")

console.log(uvScore)

function uvColor() {
    if (uvScore <= 2){
        uv.addClass("low").removeClass("moderate high severe");
    } else if(uvScore > 2 && uvScore <= 5.99 ) {
        uv.addClass("moderate").removeClass("low high severe");
    } else if(uvScore >= 6 && uvScore <= 6.99 ) {
        uv.addClass("high").removeClass("low moderate severe");
    } else {
        uv.addClass("severe").removeClass("low moderate high");
    }
};
    
    //   // update current, past, future hour with style 
    //   if(currentRowHour == currentHour) {
    //     //present 
    //     currentRow.addClass("present").removeClass("past future");
    //   } else if (currentRowHour > currentHour) {
    //     // future
    //     currentRow.addClass("future").removeClass("past present");
    //   }
    //     else {
    //     // past
    //     currentRow.addClass("past").removeClass("future present");
    //     }
   




$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#citySearch").val();
    console.log(city)

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=cd805afbcca4574c470ae7a3e6fa7c0b&units=imperial";
    var queryURL2 = "https://api.opencagedata.com/geocode/v1/json?q=" + city + "&key=35628c0d9dc346a78ee4fc254dfa24b1"
    

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

        console.log(city)
        console.log(temp)
        console.log(humidity)
        console.log(windSpeed)

        $("#city").append(city +" (" + date + ")");
        $("#temp").append(temp + String.fromCharCode(176) + "F");
        $("#humidity").append(humidity + String.fromCharCode(37));
        $("#windspeed").append(windSpeed + " MPH");
        $("#weatherImage").attr({"src": "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
        "height": "100px", "width":"100px"});
    });

        // 5 Day Forecast Query
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response2) {
        console.log(response2)
        var lat = response2.results[0].geometry.lat
        var long = response2.results[0].geometry.lng
        console.log(lat)
        console.log(long)
        localStorage.setItem("lattitude", lat)
        localStorage.setItem("longitude", long)
    });
    var lat = localStorage.getItem("lattitude", lat)
    var long = localStorage.getItem("longitude", lat)
    console.log(lat)
    console.log(long)

    var queryURL3 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + long +"&exclude=daily,hourly,minutely&appid=cd805afbcca4574c470ae7a3e6fa7c0b&units=imperial";
    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function(response3) {
        console.log(response3)
    
    var uvIndex = response3.current.uvi
    console.log(uvIndex)
    
    // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    $("#uvIndex").append(uvIndex);
    localStorage.setItem("uvScore", uvIndex)

    uvColor();
    });
});

