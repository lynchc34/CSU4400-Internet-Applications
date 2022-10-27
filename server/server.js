//set up for path
const express = require('express')
const app = express()
const port = 3000
const path = require("path")
const cors = require("cors")
let publicPath = path.resolve(__dirname, "public")

app.use(cors())
app.use(express.static(publicPath))
app.listen(port, () => console.log(`Seeking out and listening on... ${port}!`))

//set up the API call
const fetch = require("node-fetch")
const { json } = require('express')
const API_KEY = "3f3cf662c8e9191033ff4958995ef4db"
//API_KEY = process.env.API_KEY;
//debugging
//console.log(API_KEY)

//Pollution API Call
app.get('/air_pollution/:lon/:lat', pollutionData)
async function pollutionData(req, res) {
    let lon = req.params.lon
    let lat = req.params.lat
    fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
        let result = json
        res.send(result)
    })
}

//Collective Weather API Call
app.get('/forecast/:city', weatherData)
async function weatherData(req, res) {
    let city = req.params.city
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(json => {
        //debug to check data call
        //console.log(json)
        let result = json
        res.send(result)
    })
}