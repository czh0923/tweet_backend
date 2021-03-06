// connecting to airtable

require("dotenv").config();
const Airtable = require('airtable');
const base_main = new Airtable({apiKey: process.env.API_KEY}).base('appQM4HHXqwvglt66');

const final_main = new Airtable({apiKey: 'keyQUcYkOoAkjWXTV'}).base('app65fzWnjlaxHvUQ');
const table_final = final_main('final');

exports.myTables = {
    baseMain : base_main,
    finalTable: table_final
};


// data

const userNames_and_numOfTweets = {
    "user1": [10, 7], "user2":[50, 70], "user3":[80, 54], "user4":[60, 68], "user5":[50, 43], "user6":[125, 100], "user7":[100, 113], "user8":[10, 29], "user9":[20, 13], "user10":[20, 15]
}

exports.myConstants = {
    twitterUsernameAndTweetnumberMap : userNames_and_numOfTweets
}
