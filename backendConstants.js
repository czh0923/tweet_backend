// connecting to airtable

require("dotenv").config();
const Airtable = require('airtable');
const base_main = new Airtable({apiKey: process.env.API_KEY}).base('appQM4HHXqwvglt66');
const base_result = new Airtable({apiKey: process.env.API_KEY}).base('appJjZIZ2XbDCD5Gm');

const table_tweetUsers = base_main('tweet_user');
const table_collectedData = base_result('collected_data');

exports.myTables = {
    baseMain : base_main,
    twitterUserTable : table_tweetUsers,
    collectedDataTable : table_collectedData
};


// data

const userNames_and_numOfTweets = {
    "user1":17, "user2":120, "user3":134, "user4":128, "user5":93, "user6":225, "user7":213, "user8":39, "user9":33, "user10":35
}

exports.myConstants = {
    twitterUsernameAndTweetnumberMap : userNames_and_numOfTweets
}
