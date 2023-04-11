// connecting to airtable

require("dotenv").config();
const Airtable = require('airtable');
const base_main = new Airtable({apiKey: process.env.API_KEY}).base('appQM4HHXqwvglt66');

// tweetID, #rated, tweet1, type1, .... 
const base_final_structure = new Airtable({apiKey: process.env.API_KEY}).base('appdqVFUBNdKxao34');
// const table_tweets = base_final_structure('Tweets');
const table_tweets = base_final_structure('sample1');
// const table_tweets = base_final_structure('sample2');
// const table_tweets = base_final_structure('sample3');
// const table_tweets = base_final_structure('sample4');

exports.myTables = {
    baseMain : base_main,
    tableTweets: table_tweets,

};


// data

// const userNames_and_numOfTweets = {
//     "user1": [10, 7], "user2":[50, 70], "user3":[80, 54], "user4":[60, 68], "user5":[50, 43], "user6":[125, 100], "user7":[100, 113], "user8":[10, 29], "user9":[20, 13], "user10":[20, 15]
// }

// exports.myConstants = {
//     twitterUsernameAndTweetnumberMap : userNames_and_numOfTweets
// }
