const PORT = process.env.PORT || 8000; //Port option for Heroku

// Packages
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
var xpath = require('xpath')
dom = require('xmldom').DOMParser

// Xpaths
const timePlayedXPATH = "//div[@class='progress-category is-partial toggle-display is-active']//div[@class='ProgressBar-title' and contains(text(), '%s')]/..//div[@class='ProgressBar-description']"
const gameStatsXPATHBuilder = "//td[@class='DataTable-tableColumn' and contains(text(), '%s')]/..//td[2]"
const gamesLostXPATH = gameStatsXPATHBuilder.replace("%s", "Games Lost")
const gamesPlayedXPATH = gameStatsXPATHBuilder.replace("%s", "Games Played")
const gamesWonXPATH = gameStatsXPATHBuilder.replace("%s", "Games Won")
const totalTimePlayedXPATH = gameStatsXPATHBuilder.replace("%s", "Time Played")

// Initionalization
const app = express();

app.get('/', (req, res) => {
    res.json("Welcome to my api");
})

app.get('/getStat/:username/:hero', (req, res) => {
    let username = req.params.username
    const overwatchURL = 'https://playoverwatch.com/en-us/career/pc/%s/'.replace("%s", username);
    let chosenHero = req.params.hero
    axios.get(overwatchURL)
    .then((response) => {

        const html = response.data;
        var doc = new dom().parseFromString(html)
        var nodes = xpath.select(timePlayedXPATH.replace("%s", chosenHero), doc)
        let timePlayed = nodes[0].firstChild.data
        res.json(timePlayed)

    }).catch((err) => console.log(err))
})

app.get('/getGameStats/:username', (req, res) => {
    let username = req.params.username
    const overwatchURL = 'https://playoverwatch.com/en-us/career/pc/%s/'.replace("%s", username);
    axios.get(overwatchURL)
    .then((response) => {
        const html = response.data;
        const doc = new dom().parseFromString(html)

        let gamesLost = xpath.select(gamesLostXPATH, doc)[0].firstChild.data
        let gamesPlayed = xpath.select(gamesPlayedXPATH, doc)[0].firstChild.data
        let gamesWon = xpath.select(gamesWonXPATH, doc)[0].firstChild.data
        let totalTimePlayed = xpath.select(totalTimePlayedXPATH, doc)[0].firstChild.data

        const jsonGameData = {
            "gamesLost": gamesLost,
            "gamesPlayed": gamesPlayed,
            "gamesWon": gamesWon,
            "totalTimePlayed": totalTimePlayed
        }

        res.json(jsonGameData)
    }).catch((err) => console.log(err))
})


app.listen(PORT, () => console.log('Server running on port ' + PORT))