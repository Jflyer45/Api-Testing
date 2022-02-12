const PORT = 8000;

// Packages
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const xpath = require('xpath');
dom = require('xmldom').DOMParser;

// Initionalization
const app = express();

app.get('/', (req, res) => {
    res.json("Welcome to my api");
})

app.get('/news', (req, res) => {
    const overwatchURL = 'https://playoverwatch.com/en-us/career/pc/Jflyer45-1172/';
    axios.get(overwatchURL)
    .then((response) => {
        const html = response.data;
        doc = new dom().parseFromString(html);
        const times = xpath.select("//div[@class='ProgressBar-description']", html);
        console.log(times);
        // const $ = cheerio.load(html)

        // $('a:')
    })
})

app.listen(PORT, () => console.log('Server running on port ' + PORT))