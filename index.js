const PORT = process.env.PORT || 8000; //Port option for Heroku

// Packages
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
var xpath = require('xpath')
dom = require('xmldom').DOMParser

// Xpaths
const timePlayedXPATH = "//div[@class='progress-category is-partial toggle-display is-active']//div[@class='ProgressBar-title' and contains(text(), '%s')]/..//div[@class='ProgressBar-description']"

// Initionalization
const app = express();

app.get('/', (req, res) => {
    res.json("Welcome to my api");
})

// app.get('/getStat', (req, res) => {
//     const overwatchURL = 'https://playoverwatch.com/en-us/career/pc/Jflyer45-1172/';
//     axios.get(overwatchURL)
//     .then((response) => {
//         const html = response.data;
//         const $ = cheerio.load(html)
//         let bar = $('div[ProgressBar-title]:contains("Mercy")').text();
        
//         console.log("Thingy: " + bar)
        

//     }).catch((err) => console.log(err))
// })
app.get('/getStat/:username/:hero', (req, res) => {
    let username = req.params.username
    const overwatchURL = 'https://playoverwatch.com/en-us/career/pc/%s-1172/'.replace("%s", username);
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


app.listen(PORT, () => console.log('Server running on port ' + PORT))