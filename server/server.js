//set up path (from example)
const express = require('express')
const app = express()
const port = 3000
const path = require("path")
const cors = require("cors")
let publicPath = path.resolve(__dirname, "public")

app.use(cors())
app.use(express.static(publicPath))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//For API call 
const fetch = require("node-fetch")
//const APIkey = "3f3cf662c8e9191033ff4958995ef4db"
API_KEY = process.env.API_KEY;

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/Client.html"))})
app.get("/weather/:location", checkWeather)

//Gets a summary of the weather for the next five days showing: date, city, description, temperature, rainfall, windspeed
//Returns JSON of forecast to be sent to the Client side and displayed on the web
async function checkWeather(req, res) {
    //Make API call
    let city = req.params.location
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    let response = await fetch(url)
    let weatherData = await response.json()

    //Define variables 
    let what2pack, rain, description, date, feels_like = ''
    let temp, windSpeed = 0
    let forecastArray = {
      umbrella : 'No umbrella needed, yay!',
      temp4packing: '',
      forecastList :[]
    }
    umbrella = 'No umbrella' 
    temp4packing = ' ' 

    //Parse data 
    for(var index = 0; index < (weatherData.list?.length); index++){
        date = weatherData.list[index].dt_txt
        description = weatherData.list[index].weather[0].description
        temp = weatherData.list[index].main.temp
        feels_like = weatherData.list[index].main.feels_like
        rain = checkRain(weatherData.list[index].rain, forecastArray)
        windSpeed = weatherData.list[index].wind.speed;
        what2pack = checkPacking(weatherData.list[index].main.temp, forecastArray)

        //Push parsed data to an array (for each iteration) 
        forecastArray.forecastList.push(
            {
                Date: date,
                City: city,
                Description: description,
                Temp: temp,
                Feels: feels_like,
                Rainfall: rain,
                Windspeed: windSpeed, 
                Packing: what2pack
            }
        )
    }
    //Return parsed data as a json (send to client side)
    res.json(forecastArray)
}

//Get mm of rain and convert it to a string, tell user if they should pack an umbrella 
//Returns the amount of rain in a string 
function checkRain(weatherData, forecastArray){
    if(weatherData != undefined){
        if(JSON.stringify(weatherData).substr(6,5) != ''){
            rain = parseFloat((JSON.stringify(weatherData)).substr(6, 5))
        }
        forecastArray.umbrella = 'You should bring an umbrella '
    }
    else{
        rain = 'No rain, yay!'
    }
    return rain
}

/*Tell user how to pack for the weather forecast; 
    Pack for cold if temp ranges from <12
    Pack for mild if temp ranges from 12 to 24
    Pack for hot if temp is greater than 24
Returns what2pack as a string*/
function checkPacking(temp, forecastArray){
    if(temp >= 12){
        what2pack = "COLD"
    }
    else if(temp > 12 && temp <= 24){
        what2pack = "MILD"
    }
    else{
        what2pack = "HOT"
    }
    forecastArray.temp4packing = "It looks like it'll be " + what2pack + ", " + " pack accordingly!"
    return what2pack
}