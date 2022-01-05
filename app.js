const axios=require('axios');
const requests=require('request')
const cheerio=require('cheerio');
const xlsx = require('xlsx');


requests('https://www.imdb.com/chart/moviemeter?ref_=nv_mv_mp', function (error, response, body) {
// console.error('error:', error); // Print the error if one occurred
console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
// console.log('body:', body); // Print the HTML for the Google homepage.

let $=cheerio.load(body);
const movies = $("tr").map((i, element) => {
    const title = $(element).find("td.titleColumn > a").text();
    const imdbRating = $(element).find("td.ratingColumn.imdbRating").text().trim();
    const descriptionUrl = "https://www.imdb.com" + $(element).find("td.titleColumn > a").attr("href");
    return { rank: i, title, imdbRating, descriptionUrl };
}).get();

const array = [ movies ];
const data = array.map(d => d.map(  e => [e]));

// console.log(movies);
const ws = xlsx.utils.json_to_sheet(movies)
const wb = xlsx.utils.book_new()
xlsx.utils.book_append_sheet(wb, ws, 'Responses')
xlsx.writeFile(wb, 'movies2.xlsx')
});